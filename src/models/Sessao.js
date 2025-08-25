const mongoose = require("mongoose");

const SessaoSchema = new mongoose.Schema({
  visitante: { type: String, required: true },
  mestreDirigente: { type: String, required: true },
  tipoSessao: { 
    type: String, 
    enum: ["Escala", "Escala Anual", "Instrutiva", "Quadro de Mestres", "Direção", "Extra", "Adventícios", "Outros"], 
    required: true 
  },
  quemExplanou: { type: String, required: true },
  quemLeuDocumentos: { type: String, required: true },
  participantes: { type: Number, required: true },
  chamadasFeitas: { type: String },

  vegetal: { type: String, required: true },

  estoqueInicial: { type: Number, required: true }, // agora obrigatório
  quantidadeCoada: { type: Number, required: true },
  quantidadeBebida: { type: Number, required: true }, // calculado no backend
  retornoSessao: { type: Number, required: true },
  estoqueFinal: { type: Number, required: true } // calculado no backend
}, { timestamps: true });

module.exports = mongoose.model("Sessao", SessaoSchema);
