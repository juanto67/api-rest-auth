const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("private.key");
const publicKey = fs.readFileSync("public.key");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  if (User.findByEmail(email))
    return res.status(400).json({ error: "Usuario ya registrado" });

  const hashed = await argon2.hash(password);
  const user = new User(username, email, hashed);
  User.save(user);

  res.json({ message: "Usuario registrado con éxito" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = User.findByEmail(email);
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const valid = await argon2.verify(user.password, password);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign({ email: user.email }, privateKey, {
    algorithm: "RS256",
    expiresIn: "1h",
  });

  res.json({ message: "Login correcto", token, user: { username: user.username, email: user.email } });
};

module.exports = { register, login };
