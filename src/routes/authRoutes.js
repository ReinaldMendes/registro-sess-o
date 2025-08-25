const express = require("express");
const router = express.Router();
const { cadastrarUsuario, loginUsuario, listarUsuarios } = require("../controllers/authController");

router.post("/login", loginUsuario);
const autenticarToken = require("../middlewares/authMiddleware");
router.post("/register", autenticarToken, cadastrarUsuario);
router.get("/usuarios", autenticarToken , listarUsuarios); 
module.exports = router;
