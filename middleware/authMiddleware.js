const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync("public.key");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, publicKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;
