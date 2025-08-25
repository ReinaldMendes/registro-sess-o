const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// conectar banco
connectDB();

// rotas
app.use("/api/sessoes", require("./routes/sessaoRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/estoques", require("./routes/estoqueRoutes"));
module.exports = app;
