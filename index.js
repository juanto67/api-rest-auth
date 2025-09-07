const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

app.listen(4000, () => console.log("Servidor en http://localhost:4000"));
