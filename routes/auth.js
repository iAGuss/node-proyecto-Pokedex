const express = require("express");
const router = express.Router();
module.exports = router;
const { loginUsuario, registrarUsuario } = require("../controllers/auth");
router.post("/login", loginUsuario);

router.post("/registrar", registrarUsuario);
