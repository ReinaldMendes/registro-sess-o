const express = require("express");
const router = express.Router();
const { registrarEstoque, listarEstoques, derradeiroEstoque } = require("../controllers/estoqueController");
const autenticarToken = require("../middlewares/authMiddleware");
// Registrar novo estoque
router.post("/", autenticarToken, registrarEstoque);

// Listar todos os estoques
router.get("/", autenticarToken, listarEstoques);
router.get("/derradeiro", autenticarToken, derradeiroEstoque);
module.exports = router;
