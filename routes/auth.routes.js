const express = require("express");
const router = express.Router();
const { register, login, logout,autoLogin } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/authMiddleware");
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/autologin", verifyToken, autoLogin);
module.exports = router;

