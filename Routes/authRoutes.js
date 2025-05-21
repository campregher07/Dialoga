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

router.post('/authController', authController.login);
router.post('/authController', authController.cadastrar);
router.post('/authController', authController.recuperar);

module.exports = router;