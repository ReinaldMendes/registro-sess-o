<template>
    <PrivateLayout>
      <div class="sessoes-page">
        <h1>Consulta de Sessões 📋</h1>
  
        <!-- FILTRO POR DATA -->
        <div class="filtros">
          <label>Data Inicial:</label>
          <input type="date" v-model="dataInicial" />
  
          <label>Data Final:</label>
          <input type="date" v-model="dataFinal" />
  
          <button @click="filtrarPorData">Filtrar</button>
          <button @click="limparFiltros">Limpar</button>
        </div>
  
        <!-- TABELA DE SESSÕES -->
        <table v-if="sessoesPaginadas.length" class="sessoes-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Mestre Dirigente</th>
              <th>Tipo</th>
              <th>Quem Explanou</th>
              <th>Quem Leu Documentos</th>
              <th>Participantes</th>
              <th>Vegetal</th>
              <th>Estoque Inicial</th>
              <th>Qtd Coada</th>
              <th>Qtd Bebida</th>
              <th>Retorno</th>
              <th>Estoque Final</th>
              <th>Visitante</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sessoesPaginadas" :key="s._id">
              <td>{{ formatarData(s.createdAt) }}</td>
              <td>{{ s.mestreDirigente }}</td>
              <td>{{ s.tipoSessao }}</td>
              <td>{{ s.quemExplanou }}</td>
              <td>{{ s.quemLeuDocumentos }}</td>
              <td>{{ s.participantes }}</td>
              <td>{{ s.vegetal }}</td>
              <td>{{ s.estoqueInicial }}</td>
              <td>{{ s.quantidadeCoada }}</td>
              <td>{{ s.quantidadeBebida }}</td>
              <td>{{ s.retornoSessao }}</td>
              <td>{{ s.estoqueFinal }}</td>
              <td>{{ s.visitante }}</td>
            </tr>
          </tbody>
        </table>
  
        <p v-else>Nenhuma sessão encontrada.</p>
  
        <!-- PAGINAÇÃO -->
        <div v-if="sessoesFiltradas.length > itensPorPagina" class="paginacao">
          <button @click="paginaAtual--" :disabled="paginaAtual === 1">Anterior</button>
          <button
            v-for="page in totalPaginas"
            :key="page"
            @click="paginaAtual = page"
            :class="{ ativo: paginaAtual === page }"
          >
            {{ page }}
          </button>
          <button @click="paginaAtual++" :disabled="paginaAtual === totalPaginas">Próximo</button>
        </div>
  
        <!-- BOTÃO RELATÓRIO -->
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

const API_SESSOES = import.meta.env.VITE_API_URL + "/api/sessoes/listarSessoes";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

const sessoes = ref([]);
const dataInicial = ref("");
const dataFinal = ref("");
const paginaAtual = ref(1);
const totalPaginas = ref(1);
const itensPorPagina = 10;

const carregarSessoes = async () => {
  try {
    const params = {
      page: paginaAtual.value,
      limit: itensPorPagina,
    };
    if (dataInicial.value) params.inicio = dataInicial.value;
    if (dataFinal.value) params.fim = dataFinal.value;

    const res = await axios.get(API_SESSOES, { params });
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
  return new Date(dataStr).toLocaleDateString("pt-BR");
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
    s.vegetal,
    s.estoqueInicial,
    s.quantidadeCoada,
    s.quantidadeBebida,
    s.retornoSessao,
    s.estoqueFinal,
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
        "Vegetal",
        "Estoque Inicial",
        "Qtd Coada",
        "Qtd Bebida",
        "Retorno",
        "Estoque Final",
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
  
  .sessoes-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .sessoes-table th,
  .sessoes-table td {
    padding: 0.5rem;
    border: 1px solid #ddd;
    font-size: 0.9rem;
  }
  
  .sessoes-table th {
    background: #0c7c59;
    color: #fff;
  }
  
  .sessoes-table tr:hover {
    background: #f5f5f5;
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
  </style>
  