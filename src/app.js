const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174','https://registro-sessaofront.onrender.com'];
// middlewares
app.use(cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true); // permite Postman etc
      if(allowedOrigins.indexOf(origin) === -1){
        console.warn('Origem não permitida pelo CORS: ' + origin);
        return callback(null, false); // Rejeita o CORS mas não retorna erro
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

// conectar banco
connectDB();

// rotas
app.use("/api/sessoes", require("./routes/sessaoRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/estoques", require("./routes/estoqueRoutes"));
module.exports = app;
