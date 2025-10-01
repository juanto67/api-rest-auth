const express = require("express");
const router = express.Router();
const { register, login, logout, autoLogin } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/auto-login", verifyToken, autoLogin);

module.exports = router;