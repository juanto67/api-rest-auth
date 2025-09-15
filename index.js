const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // <-- Añade esto
const app = express();
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

app.use(express.json());
app.use(cookieParser()); // <-- Añade esto


// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/api-rest-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.error("Error de conexión a MongoDB:", err));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

app.listen(4000, () => console.log("Servidor en http://localhost:4000"));