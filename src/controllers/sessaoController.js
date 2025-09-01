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
    const { inicio, fim, mestre, explanou, leuDocs, page = 1, limit = 10 } = req.query;

    let filtro = {};

    // Filtro por data
    if (inicio && fim) {
      filtro.dataSessao = { 
        $gte: new Date(inicio), 
        $lte: new Date(fim) 
      };
    }

    // Filtro por Mestre Dirigente (busca parcial com expressão regular e case-insensitive)
    if (mestre) {
      filtro.mestreDirigente = { $regex: mestre, $options: 'i' };
    }

    // Filtro por Quem Explanou (busca parcial e case-insensitive)
    if (explanou) {
      filtro.quemExplanou = { $regex: explanou, $options: 'i' };
    }

    // Filtro por Quem Leu Documentos (busca parcial e case-insensitive)
    if (leuDocs) {
      filtro.quemLeuDocumentos = { $regex: leuDocs, $options: 'i' };
    }

    // Paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sessoes, total] = await Promise.all([
      Sessao.find(filtro)
        .sort({ dataSessao: 1 })
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

// As outras funções (buscarSessao, editarSessao, excluirSessao)
// permanecem as mesmas.
// ... (código delas) ...

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
// controllers/sessaoController.js

// ... (código existente da controller) ...


// FUNÇÕES DO DASHBOARD
exports.getDashboardStats = async (req, res) => {
  try {
    const ultimoEstoque = await Estoque.findOne().sort({ createdAt: -1 });
    
    // Se não houver estoque, retorna valores padrão
    if (!ultimoEstoque) {
      return res.json({ estoqueAtual: 0, dataUltimaAtualizacao: null });
    }
    
    // Retorna o valor e a data do último registro de estoque
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
      .select("mestreDirigente dataSessao"); // Adicionamos 'dataSessao'
      
    res.json(ultimosDirigentes); // Agora retorna o objeto completo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUltimosExplanadores = async (req, res) => {
  try {
    const ultimosExplanadores = await Sessao.find({})
      .sort({ dataSessao: -1 })
      .limit(5)
      .select("quemExplanou dataSessao"); // Adicionamos 'dataSessao'
    
    res.json(ultimosExplanadores); // Agora retorna o objeto completo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUltimosLeitores = async (req, res) => {
  try {
    const ultimosLeitores = await Sessao.find({})
      .sort({ dataSessao: -1 })
      .limit(5)
      .select("quemLeuDocumentos dataSessao"); // Adicionamos 'dataSessao'

    res.json(ultimosLeitores); // Agora retorna o objeto completo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsumoMedio = async (req, res) => {
  try {
    const sessoesComConsumo = await Sessao.find({ quantidadeBebida: { $exists: true, $ne: null } })
      .sort({ dataSessao: -1 }) // Ordena da mais recente para a mais antiga
      .limit(5); // Limita para as 5 últimas sessões

    const dadosConsumo = sessoesComConsumo.map(s => ({
      // Garantimos que a data é um formato legível para o gráfico
      data: new Date(s.dataSessao).toLocaleDateString('pt-BR'), 
      consumo: s.quantidadeBebida || 0 // Pega o valor ou 0 se for nulo
    }));

    // Invertemos o array para o gráfico ficar em ordem cronológica
    res.json(dadosConsumo.reverse()); 
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
