<template>
  <PrivateLayout>
    <div class="sessoes-page">
      <h1>Consulta de Sessões 📋</h1>

      <div class="filtros">
        <label>Data Inicial:</label>
        <input type="date" v-model="dataInicial" />

        <label>Data Final:</label>
        <input type="date" v-model="dataFinal" />

        <button @click="filtrarPorData">Filtrar</button>
        <button @click="limparFiltros">Limpar</button>
      </div>

      <div class="table-container">
        <table v-if="sessoes.length" class="sessoes-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Mestre Dirigente</th>
              <th>Tipo</th>
              <th>Quem Explanou</th>
              <th>Quem Leu Documentos</th>
              <th>Participantes</th>
              <th>Visitante</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sessoes" :key="s._id">
              <template v-if="sessaoSendoEditada._id !== s._id">
                <td>{{ formatarData(s.dataSessao) }}</td>
                <td>{{ s.mestreDirigente }}</td>
                <td>{{ s.tipoSessao }}</td>
                <td>{{ s.quemExplanou }}</td>
                <td>{{ s.quemLeuDocumentos }}</td>
                <td>{{ s.participantes }}</td>
                <td>{{ s.visitante }}</td>
                <td class="acoes-coluna">
                  <button @click="iniciarEdicao(s)" class="btn-acao editar">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button @click="excluirSessao(s._id)" class="btn-acao excluir">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </template>

              <template v-else>
                <td data-label="Data">
                  <input type="date" v-model="sessaoSendoEditada.dataSessao" />
                </td>
                <td data-label="Mestre Dirigente">
                  <input type="text" v-model="sessaoSendoEditada.mestreDirigente" />
                </td>
                <td data-label="Tipo">
                  <input type="text" v-model="sessaoSendoEditada.tipoSessao" />
                </td>
                <td data-label="Quem Explanou">
                  <input type="text" v-model="sessaoSendoEditada.quemExplanou" />
                </td>
                <td data-label="Quem Leu Documentos">
                  <input type="text" v-model="sessaoSendoEditada.quemLeuDocumentos" />
                </td>
                <td data-label="Participantes">
                  <input type="text" v-model="sessaoSendoEditada.participantes" />
                </td>
                <td data-label="Visitante">
                  <input type="text" v-model="sessaoSendoEditada.visitante" />
                </td>
                <td class="acoes-coluna">
                  <button @click="salvarEdicao" class="btn-acao salvar">
                    <i class="fas fa-check"></i>
                  </button>
                  <button @click="cancelarEdicao" class="btn-acao cancelar">
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <template>
  <PrivateLayout>
    <div class="sessoes-page">
      <h1>Consulta de Sessões 📋</h1>

      <div class="filtros">
        </div>

      <div class="table-container">
        <table v-if="sessoes.length" class="sessoes-table">
          </table>
        <p v-else>Nenhuma sessão encontrada.</p>
      </div>

      </div>
  </PrivateLayout>
</template>

      <div v-if="totalPaginas > 1" class="paginacao">
        <button @click="paginaAtual--; carregarSessoes()" :disabled="paginaAtual === 1">Anterior</button>

        <button
          v-for="page in totalPaginas"
          :key="page"
          @click="paginaAtual = page; carregarSessoes()"
          :class="{ ativo: paginaAtual === page }"
        >
          {{ page }}
        </button>

        <button @click="paginaAtual++; carregarSessoes()" :disabled="paginaAtual === totalPaginas">Próximo</button>
      </div>

      <div class="relatorio-botoes">
        <button @click="imprimirRelatorio" class="btn-imprimir">
          Imprimir Relatório PDF
        </button>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import PrivateLayout from "../components/PrivateLayout.vue";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_SESSOES = import.meta.env.VITE_API_URL + "/api/sessoes";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

const sessoes = ref([]);
const dataInicial = ref("");
const dataFinal = ref("");
const paginaAtual = ref(1);
const totalPaginas = ref(1);
const itensPorPagina = 10;
const sessaoSendoEditada = ref({});

const carregarSessoes = async () => {
  try {
    const params = {
      page: paginaAtual.value,
      limit: itensPorPagina,
    };
    if (dataInicial.value) params.inicio = dataInicial.value;
    if (dataFinal.value) params.fim = dataFinal.value;

    const res = await axios.get(API_SESSOES + "/listarSessoes", { params });
    sessoes.value = res.data.sessoes;
    totalPaginas.value = res.data.totalPages;
  } catch (e) {
    console.error("Erro ao carregar sessões", e);
  }
};

onMounted(carregarSessoes);

const filtrarPorData = () => {
  paginaAtual.value = 1;
  carregarSessoes();
};

const limparFiltros = () => {
  dataInicial.value = "";
  dataFinal.value = "";
  carregarSessoes();
};

const formatarData = (dataStr) => {
  // Converte a data do formato ISO para o formato de exibição.
  return new Date(dataStr).toLocaleDateString("pt-BR");
};

// --- MÉTODOS DE EDIÇÃO NA LINHA ---
const iniciarEdicao = (sessao) => {
  // Cria uma cópia da sessão, garantindo que a data esteja no formato correto para o input.
  const dataFormatada = new Date(sessao.dataSessao).toISOString().split('T')[0];
  sessaoSendoEditada.value = { ...sessao, dataSessao: dataFormatada };
};

const salvarEdicao = async () => {
  try {
    const id = sessaoSendoEditada.value._id;
    // Remove o _id para evitar erros de atualização no backend.
    const dadosParaAtualizar = { ...sessaoSendoEditada.value };
    delete dadosParaAtualizar._id;

    await axios.put(`${API_SESSOES}/editarSessao/${id}`, dadosParaAtualizar);

    // Mensagem de sucesso melhorada
    alert("✅ Sessão atualizada com sucesso!");
    // Limpa o objeto de edição para voltar ao modo de visualização.
    sessaoSendoEditada.value = {};
    // Recarrega a tabela para mostrar a alteração.
    carregarSessoes();
  } catch (e) {
    console.error("Erro ao salvar a edição", e);
    alert("❌ Erro ao salvar a sessão. Tente novamente.");
  }
};

const cancelarEdicao = () => {
  sessaoSendoEditada.value = {};
};

// Exclui uma sessão
const excluirSessao = async (id) => {
  if (confirm("Tem certeza que deseja excluir esta sessão?")) {
    try {
      await axios.delete(`${API_SESSOES}/excluirSessao/${id}`);
      alert("✅ Sessão excluída com sucesso!");
      carregarSessoes();
    } catch (e) {
      console.error("Erro ao excluir sessão", e);
      alert("❌ Erro ao excluir a sessão. Tente novamente.");
    }
  }
};

const imprimirRelatorio = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Relatório de Sessões", 14, 20);

  const dadosTabela = sessoes.value.map((s) => [
    formatarData(s.dataSessao),
    s.mestreDirigente,
    s.tipoSessao,
    s.quemExplanou,
    s.quemLeuDocumentos,
    s.participantes,
    s.visitante,
  ]);

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Data",
        "Mestre",
        "Tipo",
        "Explanou",
        "Leu Docs",
        "Participantes",
        "Visitante",
      ],
    ],
    body: dadosTabela,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: "#0c7c59" },
  });

  doc.save("relatorio_sessoes.pdf");
};
</script>

---

<style scoped>
.sessoes-page {
  padding: 2rem;
  max-width: 95%;
  margin: 0 auto;
}

.filtros {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sessoes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* Garante uma largura mínima */
}

.sessoes-table th,
.sessoes-table td {
  padding: 0.8rem;
  border: 1px solid #ddd;
  font-size: 0.9rem;
}

.sessoes-table th {
  background: #0c7c59;
  color: #fff;
  white-space: nowrap; /* Evita quebra de linha no cabeçalho */
}

.sessoes-table tr:hover {
  background: #f5f5f5;
}

.sessoes-table input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.paginacao {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.3rem;
}

.btn-imprimir {
  margin-top: 1rem;
  background: #0c7c59;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.btn-imprimir:hover {
  background: #095c45;
}

/* --- ESTILOS DE AÇÃO --- */
.acoes-coluna {
  text-align: center;
  white-space: nowrap; /* Evita quebra de linha nos botões */
}

.btn-acao {
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  padding: 0;
  font-size: 1rem;
  transition: transform 0.2s;
}

.btn-acao.editar {
  color: #0c7c59;
}

.btn-acao.excluir {
  color: #d9534f;
}

.btn-acao:hover {
  transform: scale(1.1);
}

.btn-acao.salvar {
  color: #28a745;
}

.btn-acao.cancelar {
  color: #ffc107;
}

/* --- ESTILOS PARA RESPONSIVIDADE (NOVA ABORDAGEM) --- */
@media (max-width: 768px) {
  .sessoes-table {
    min-width: 100%; /* Ajusta a largura mínima para 100% em telas menores */
  }

  .table-container {
    overflow-x: auto;
  }
}
</style>