const express = require("express");
const router = express.Router();
const { criarSessao, listarSessoes, buscarSessao, deletarSessao } = require("../controllers/sessaoController");

router.post("/", criarSessao);
router.get("/", listarSessoes);
router.get("/:id", buscarSessao);
router.delete("/:id", deletarSessao);

module.exports = router;
