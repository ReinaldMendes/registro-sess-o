const express = require("express");
const router = express.Router();
const {
  criarSessao,
  listarSessoes,
  buscarSessao,
  deletarSessao
} = require("../controllers/sessaoController");

const autenticarToken = require("../middlewares/authMiddleware");

// Rotas protegidas
router.post("/", autenticarToken, criarSessao);
router.get("/listarSessoes", autenticarToken, listarSessoes);
router.get("/:id", autenticarToken, buscarSessao);
router.delete("/:id", autenticarToken, deletarSessao);

module.exports = router;
