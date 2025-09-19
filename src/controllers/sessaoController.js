const Sessao = require("../models/Sessao");
const Estoque = require("../models/Estoque");

exports.criarSessao = async (req, res) => {
  try {
    const {
      visitantes,
      mestreDirigente,
      tipoSessao,
      quemExplanou,
      quemLeuDocumentos,
      participantes,
      vegetal,
      quantidadeCoada,
      retornoSessao,
      dataSessao
      // 'chamadasFeitas' não é mais necessário na desestruturação, pois é opcional
    } = req.body;
    
    // O frontend agora envia o estoque inicial. Vamos usá-lo.
    const estoqueInicial = req.body.estoqueInicial;
    
    const quantidadeBebida = quantidadeCoada - retornoSessao;
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
    const { inicio, fim, mestre, explanou, leuDocs, page = 1, limit = 10 } = req.query;

    let filtro = {};

    if (inicio && fim) {
      filtro.dataSessao = { 
        $gte: new Date(inicio), 
        $lte: new Date(fim) 
      };
    }

    if (mestre) {
      filtro.mestreDirigente = { $regex: mestre, $options: 'i' };
    }

    if (explanou) {
      filtro.quemExplanou = { $regex: explanou, $options: 'i' };
    }

    if (leuDocs) {
      filtro.quemLeuDocumentos = { $regex: leuDocs, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sessoes, total] = await Promise.all([
      Sessao.find(filtro)
        .sort({ dataSessao: -1 })
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

exports.editarSessao = async (req, res) => {
  try {
    const sessaoId = req.params.id;
    const dadosAtualizados = req.body;

    delete dadosAtualizados._id;

    const sessaoAtualizada = await Sessao.findByIdAndUpdate(
      sessaoId,
      dadosAtualizados,
      { new: true, runValidators: true }
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

// FUNÇÕES DO DASHBOARD
exports.getDashboardStats = async (req, res) => {
  try {
    const ultimoEstoque = await Estoque.findOne().sort({ createdAt: -1 });
    
    if (!ultimoEstoque) {
      return res.json({ estoqueAtual: 0, dataUltimaAtualizacao: null });
    }
    
    res.json({
      estoqueAtual: ultimoEstoque.quantidade,
      dataUltimaAtualizacao: ultimoEstoque.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUltimosDirigentes = async (req, res) => {
  try {
    const ultimosDirigentes = await Sessao.find({})
      .sort({ dataSessao: -1 })
      .limit(5)
      .select("mestreDirigente dataSessao");
      
    res.json(ultimosDirigentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUltimosExplanadores = async (req, res) => {
  try {
    const ultimosExplanadores = await Sessao.find({})
      .sort({ dataSessao: -1 })
      .limit(5)
      .select("quemExplanou dataSessao");
    
    res.json(ultimosExplanadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUltimosLeitores = async (req, res) => {
  try {
    const ultimosLeitores = await Sessao.find({})
      .sort({ dataSessao: -1 })
      .limit(5)
      .select("quemLeuDocumentos dataSessao");

    res.json(ultimosLeitores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsumoMedio = async (req, res) => {
  try {
    const sessoesComConsumo = await Sessao.find({ quantidadeBebida: { $exists: true, $ne: null } })
      .sort({ dataSessao: -1 })
      .limit(5);

    const dadosConsumo = sessoesComConsumo.map(s => ({
      data: new Date(s.dataSessao).toLocaleDateString('pt-BR'), 
      consumo: s.quantidadeBebida || 0
    }));

    res.json(dadosConsumo.reverse()); 
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};