const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const authController = require('../Controllers/authController');
require("../models/User")


router.get("/", function(req,res) {
    res.render("Auth/index")
});

router.get("/cadastre-se", function(req,res) {
    res.render("Auth/cadastro")
});

router.get("/recuperarSenha", function(req,res) {
    res.render("Auth/recuperacao")
});

router.post('/login', authController.login);
router.post('/cadastrar', authController.cadastrar);
router.post('/recuperar', authController.recuperar);

module.exports = router;