const Estoque = require("../models/Estoque");

exports.registrarEstoque = async (req, res) => {
  try {
    const novoEstoque = new Estoque(req.body);
    await novoEstoque.save();
    res.status(201).json(novoEstoque);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarEstoques = async (req, res) => {
  try {
    const estoques = await Estoque.find().sort({ createdAt: -1 });
    res.json(estoques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.derradeiroEstoque = async (req, res) => {
    try {
      const ultimo = await Estoque.findOne().sort({ createdAt: -1 }); // pega o último registro
      if (!ultimo) return res.json({ quantidade: 0 }); // se não existir, retorna 0
      res.json({ quantidade: ultimo.quantidade });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };