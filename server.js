const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Habilita CORS para requisições externas (PC, celular, etc.)
app.use(cors({
  origin: "*", // ou coloque o domínio do seu front se quiser restringir
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se você tiver um build do front dentro do projeto (ex: dist ou build)
app.use(express.static(path.join(__dirname, "../dist"))); // ou "../build"

// Fallback para SPA (Vue/React)
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html")); // ajuste se for build/
// });

module.exports = app;
