const express = require("express");
const router = express.Router();
const { cadastrarUsuario, loginUsuario } = require("../controllers/authController");

router.post("/register", cadastrarUsuario);
router.post("/login", loginUsuario);

module.exports = router;
