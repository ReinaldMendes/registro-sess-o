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
    const { inicio, fim, page = 1, limit = 10 } = req.query;

    // filtro por data
    let filtro = {};
    if (inicio && fim) {
      filtro.dataSessao = {
        $gte: new Date(inicio),
        $lte: new Date(fim)
      };
    }

    // paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sessoes, total] = await Promise.all([
      Sessao.find(filtro)
        .sort({ dataSessao: 1 }) // ordena pela data da sessão
        .skip(skip)
        .limit(parseInt(limit)),
      Sessao.countDocuments(filtro)
    ]);

    res.json({
      sessoes,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
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

// --- MÉTODOS NOVOS E AJUSTADOS ---

exports.editarSessao = async (req, res) => {
  try {
    const sessaoId = req.params.id;
    const dadosAtualizados = req.body;

    // Garante que o ID do Mongoose não seja atualizado
    delete dadosAtualizados._id;

    const sessaoAtualizada = await Sessao.findByIdAndUpdate(
      sessaoId,
      dadosAtualizados,
      { new: true, runValidators: true } // new: true retorna o documento atualizado; runValidators: true executa as validações do schema
    );

    if (!sessaoAtualizada) {
      return res.status(404).json({ msg: "Sessão não encontrada" });
    }

    res.json(sessaoAtualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.excluirSessao = async (req, res) => {
  try {
    const sessao = await Sessao.findByIdAndDelete(req.params.id);
    if (!sessao) return res.status(404).json({ msg: "Sessão não encontrada" });
    res.json({ msg: "Sessão removida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};