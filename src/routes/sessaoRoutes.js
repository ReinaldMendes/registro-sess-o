// routes/sessaoRoutes.js
const express = require("express");
const router = express.Router();
const sessaoController = require("../controllers/sessaoController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, sessaoController.criarSessao);
router.get("/listarSessoes", auth, sessaoController.listarSessoes);
router.get("/:id", auth, sessaoController.buscarSessao);
router.put("/editarSessao/:id", auth, sessaoController.editarSessao);
router.delete("/excluirSessao/:id", auth, sessaoController.excluirSessao);

// Novas rotas para o dashboard
router.get("/dashboard/stats", auth, sessaoController.getDashboardStats);
router.get("/dashboard/consumo-medio", auth, sessaoController.getConsumoMedio);
router.get("/dashboard/ultimos-dirigentes", auth, sessaoController.getUltimosDirigentes);
router.get("/dashboard/ultimos-explanadores", auth, sessaoController.getUltimosExplanadores);
router.get("/dashboard/ultimos-leitores", auth, sessaoController.getUltimosLeitores);

module.exports = router;