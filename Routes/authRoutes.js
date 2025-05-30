const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.get("/", function(req,res) {
    res.render("auth/index")
});

router.get("/cadastre-se", function(req,res) {
    res.render("auth/cadastro")
});

router.get("/recuperarSenha", function(req,res) {
    res.render("auth/recuperacao")
});

router.post('/login', authController.login);
router.post('/cadastrar', authController.cadastrar);
router.post('/recuperar', authController.recuperar);

module.exports = router;