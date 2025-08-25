const Sessao = require("../models/Sessao");
const Estoque = require("../models/Estoque");

exports.criarSessao = async (req, res) => {
  try {
    // Pega o estoque atual
    const ultimoEstoque = await Estoque.findOne().sort({ createdAt: -1 });
    const estoqueInicial = ultimoEstoque ? ultimoEstoque.quantidade : 0;

    const quantidadeBebida = req.body.quantidadeCoada - req.body.retornoSessao;
    const estoqueFinal = estoqueInicial - quantidadeBebida;

    // Cria a sessão
    const novaSessao = new Sessao({
      ...req.body,
      estoqueInicial,
      quantidadeBebida,
      estoqueFinal
    });

    await novaSessao.save();

    // Atualiza a tabela de Estoque
    await Estoque.create({ quantidade: estoqueFinal });

    res.status(201).json(novaSessao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarSessoes = async (req, res) => {
  try {
    const sessoes = await Sessao.find().sort({ createdAt: 1 }); // ordenar por data
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
