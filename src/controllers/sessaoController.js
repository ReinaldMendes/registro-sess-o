const Sessao = require("../models/Sessao");

exports.criarSessao = async (req, res) => {
  try {
    const novaSessao = new Sessao(req.body);
    await novaSessao.save();
    res.status(201).json(novaSessao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarSessoes = async (req, res) => {
  try {
    const sessoes = await Sessao.find();
    res.json(sessoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscarSessao = async (req, res) => {
  try {
    const sessao = await Sessao.findById(req.params.id);
    if (!sessao) return res.status(404).json({ msg: "Sessão não encontrada" });
    res.json(sessao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletarSessao = async (req, res) => {
  try {
    const sessao = await Sessao.findByIdAndDelete(req.params.id);
    if (!sessao) return res.status(404).json({ msg: "Sessão não encontrada" });
    res.json({ msg: "Sessão removida" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
