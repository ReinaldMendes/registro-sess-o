const express = require("express");
const router = express.Router();
const {
  criarSessao,
  listarSessoes,
  buscarSessao,
  editarSessao, // Adicionado
  excluirSessao // Adicionado
} = require("../controllers/sessaoController");

const autenticarToken = require("../middlewares/authMiddleware");

// Rotas protegidas
router.post("/", autenticarToken, criarSessao);
router.get("/listarSessoes", autenticarToken, listarSessoes);
router.get("/:id", autenticarToken, buscarSessao);

// Nova rota para edição (PUT)
router.put("/editarSessao/:id", autenticarToken, editarSessao);

// Rota para exclusão (DELETE)
router.delete("/excluirSessao/:id", autenticarToken, excluirSessao);

module.exports = router;