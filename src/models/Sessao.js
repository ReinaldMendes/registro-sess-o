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

  estoqueInicial: { type: Number },
  quantidadeCoada: { type: Number, required: true },
  quantidadeBebida: { type: Number },
  retornoSessao: { type: Number, required: true },
  estoqueFinal: { type: Number }
}, { timestamps: true });

// hook para calcular
SessaoSchema.pre("save", async function(next) {
  this.quantidadeBebida = this.quantidadeCoada - this.retornoSessao;

  // pegar última sessão para calcular estoqueInicial
  const ultimaSessao = await this.constructor.findOne().sort({ createdAt: -1 });

  if (ultimaSessao) {
    this.estoqueInicial = ultimaSessao.estoqueFinal;
  } else {
    this.estoqueInicial = this.estoqueInicial || 0; // primeira sessão
  }

  this.estoqueFinal = this.estoqueInicial - this.quantidadeBebida;

  next();
});

module.exports = mongoose.model("Sessao", SessaoSchema);
