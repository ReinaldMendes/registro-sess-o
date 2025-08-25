const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado. Nenhum token fornecido." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // joga os dados do usuário dentro do req
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido ou expirado." });
  }
};

module.exports = authMiddleware;
