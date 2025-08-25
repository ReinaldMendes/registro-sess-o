const mongoose = require("mongoose");

const EstoqueSchema = new mongoose.Schema({
  quantidade: { type: Number, required: true },
  observacao: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Estoque", EstoqueSchema);
