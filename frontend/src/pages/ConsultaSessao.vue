<template>
  <PrivateLayout>
    <div class="sessoes-page">
      <h1>Consulta de Sessões 📋</h1>

      <div class="filtros-container">
        <div class="filtro-grupo">
          <label for="dataInicial">Data Inicial:</label>
          <input type="date" id="dataInicial" v-model="dataInicial" />
        </div>

        <div class="filtro-grupo">
          <label for="dataFinal">Data Final:</label>
          <input type="date" id="dataFinal" v-model="dataFinal" />
        </div>
        
        <div class="filtro-grupo">
          <label for="mestre">Mestre:</label>
          <input type="text" id="mestre" v-model="filtroMestre" placeholder="Nome do Mestre" />
        </div>

        <div class="filtro-grupo">
          <label for="explanou">Explanou:</label>
          <input type="text" id="explanou" v-model="filtroExplanou" placeholder="Nome de quem explanou" />
        </div>

        <div class="filtro-grupo">
          <label for="leuDocs">Leu Docs:</label>
          <input type="text" id="leuDocs" v-model="filtroLeuDocs" placeholder="Nome de quem leu" />
        </div>
        
        <div class="botoes-filtro">
          <button @click="aplicarFiltros" class="btn-filtro btn-filtrar">Filtrar</button>
          <button @click="limparFiltros" class="btn-filtro btn-limpar">Limpar</button>
        </div>
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
        <p v-else>Nenhuma sessão encontrada.</p>
      </div>

      <div v-if="totalPaginas > 1" class="paginacao-container">
        <button 
          @click="paginaAtual--; carregarSessoes()" 
          :disabled="paginaAtual === 1" 
          class="paginacao-btn"
        >
          Anterior
        </button>

        <button
          v-for="page in totalPaginas"
          :key="page"
          @click="paginaAtual = page; carregarSessoes()"
          :class="['paginacao-btn', { 'ativo': paginaAtual === page }]"
        >
          {{ page }}
        </button>

        <button 
          @click="paginaAtual++; carregarSessoes()" 
          :disabled="paginaAtual === totalPaginas" 
          class="paginacao-btn"
        >
          Próximo
        </button>
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
const filtroMestre = ref("");
const filtroExplanou = ref("");
const filtroLeuDocs = ref("");
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
    if (filtroMestre.value) params.mestre = filtroMestre.value;
    if (filtroExplanou.value) params.explanou = filtroExplanou.value;
    if (filtroLeuDocs.value) params.leuDocs = filtroLeuDocs.value;

    const res = await axios.get(API_SESSOES + "/listarSessoes", { params });
    sessoes.value = res.data.sessoes;
    totalPaginas.value = res.data.totalPages;
  } catch (e) {
    console.error("Erro ao carregar sessões", e);
  }
};

onMounted(carregarSessoes);

const aplicarFiltros = () => {
  paginaAtual.value = 1;
  carregarSessoes();
};

const limparFiltros = () => {
  dataInicial.value = "";
  dataFinal.value = "";
  filtroMestre.value = "";
  filtroExplanou.value = "";
  filtroLeuDocs.value = "";
  aplicarFiltros();
};

const formatarData = (dataStr) => {
  return new Date(dataStr).toLocaleDateString("pt-BR");
};

const iniciarEdicao = (sessao) => {
  const dataFormatada = new Date(sessao.dataSessao).toISOString().split('T')[0];
  sessaoSendoEditada.value = { ...sessao, dataSessao: dataFormatada };
};

const salvarEdicao = async () => {
  try {
    const id = sessaoSendoEditada.value._id;
    const dadosParaAtualizar = { ...sessaoSendoEditada.value };
    delete dadosParaAtualizar._id;

    await axios.put(`${API_SESSOES}/editarSessao/${id}`, dadosParaAtualizar);

    alert("✅ Sessão atualizada com sucesso!");
    sessaoSendoEditada.value = {};
    carregarSessoes();
  } catch (e) {
    console.error("Erro ao salvar a edição", e);
    alert("❌ Erro ao salvar a sessão. Tente novamente.");
  }
};

const cancelarEdicao = () => {
  sessaoSendoEditada.value = {};
};

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
/* Estilos Gerais */
.sessoes-page {
  padding: 2rem;
  max-width: 95%;
  margin: 0 auto;
}

h1 {
  color: #0c7c59;
}

/* Filtros */
.filtros-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  align-items: flex-end;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
}

.filtro-grupo label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.filtro-grupo input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.filtro-grupo input:focus {
  border-color: #0c7c59;
  box-shadow: 0 0 5px rgba(12, 124, 89, 0.3);
  outline: none;
}

.botoes-filtro {
  display: flex;
  gap: 1rem;
}

.btn-filtro {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  min-width: 100px;
}

.btn-filtrar {
  background-color: #0c7c59;
  color: #fff;
}

.btn-filtrar:hover {
  background-color: #095c45;
  transform: translateY(-2px);
}

.btn-limpar {
  background-color: #e0e0e0;
  color: #333;
}

.btn-limpar:hover {
  background-color: #ccc;
  transform: translateY(-2px);
}

/* Tabela e Responsividade */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sessoes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
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
  white-space: nowrap;
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

/* Paginação - Estilização Aprimorada */
.paginacao-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.paginacao-btn {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.paginacao-btn:hover:not([disabled]) {
  background-color: #f0f0f0;
  border-color: #0c7c59;
}

.paginacao-btn.ativo {
  background-color: #0c7c59;
  color: #fff;
  border-color: #0c7c59;
}

.paginacao-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Botão de relatório */
.relatorio-botoes {
  text-align: center;
  margin-top: 2rem;
}

.btn-imprimir {
  background: #0c7c59;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}
.btn-imprimir:hover {
  background: #095c45;
  transform: translateY(-2px);
}

/* Estilos de Ação na Tabela */
.acoes-coluna {
  text-align: center;
  white-space: nowrap;
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

/* Responsividade */
@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>