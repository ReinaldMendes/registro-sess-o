const mongoose = require("mongoose");

const SessaoSchema = new mongoose.Schema({
  visitantes: { type: String, required: true },
  mestreDirigente: { type: String, required: true },
  tipoSessao: { 
    type: String, 
    enum: ["Escala", "Escala Anual", "Instrutiva", "Quadro de Mestres", "Direção", "Extra", "Adventícios", "Outros"], 
    required: true 
  },
  quemExplanou: { type: String, required: false },
  quemLeuDocumentos: { type: String, required: false },
  participantes: { type: Number, required: false },
  chamadasFeitas: { type: String },
  vegetal: { type: String, required: true },
  estoqueInicial: { type: Number, required: true }, 
  quantidadeCoada: { type: Number, required: true },
  quantidadeBebida: { type: Number, required: true }, 
  retornoSessao: { type: Number, required: true },
  estoqueFinal: { type: Number, required: true },
  dataSessao: { type: Date, required: true } // <--- novo campo
}, { timestamps: true });

module.exports = mongoose.model("Sessao", SessaoSchema);
