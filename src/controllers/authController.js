const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) return res.status(400).json({ msg: "Email já cadastrado" });

    const usuario = new Usuario({ nome, email, senha });
    await usuario.save();

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ usuario: { id: usuario._id, nome, email }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: "Usuário não encontrado" });

    const senhaValida = await usuario.checarSenha(senha);
    if (!senhaValida) return res.status(400).json({ msg: "Senha incorreta" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha"); // não retorna a senha
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
  }
};
