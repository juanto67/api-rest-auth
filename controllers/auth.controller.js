const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Session = require("../models/Session");
const privateKey = fs.readFileSync("private.key");
const publicKey = fs.readFileSync("public.key");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ error: "Usuario ya registrado" });

  const hashed = await argon2.hash(password);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();
  res.json({ message: "Usuario registrado con éxito" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const valid = await argon2.verify(user.password, password);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });
  const existenteSession = await Session.findOne({ userId: user._id });
  if (existenteSession) return res.status(401).json({ error: "Ya existe una sesión activa para este usuario" });
  const token = jwt.sign(
  { _id: user._id, email: user.email },
  privateKey,
  { algorithm: "RS256", expiresIn: "1h" }
  );
   await Session.create({ userId: user._id, token });
  // CREA LA COOKIE CON EL TOKEN (1 hora de duración)
  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

  res.json({ message: "Login correcto", token, user: { username: user.username, email: user.email } });
};
const logout = async (req, res) => {
  try {
    // El usuario autenticado está en req.user
    await Session.deleteOne({ userId: req.user._id });
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

const autoLogin = async (req, res) => {
  try {
    const { email } = req.user; // El email viene del token
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    res.json({ message: "Sesión iniciada con cookie", user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión con cookie" });
  }
};

module.exports = { register, login,logout, autoLogin };