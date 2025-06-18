const mongoose = require('mongoose')
const User = require('../models/User');


exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.render("Auth/index", { erroMessage: "Email e senha são obrigatórios.", username: "" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !(await user.comparePassword(senha))) {
            // Usamos o método comparePassword que definimos no modelo User.js
            return res.render("Auth/index", { erroMessage: "Credenciais inválidas.", username: "" });
        }


        req.session.username = user.nome;
        req.session.userId = user._id; 
        return res.redirect("/home");

    } catch (err) {
        console.error("Erro ao verificar login:", err);
        return res.status(500).render("Auth/index", { erroMessage: "Erro interno ao tentar fazer login.", username: "" });
    }
};


exports.cadastrar  = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.render("Auth/cadastro", { erroMessage: "Todos os campos são obrigatórios." });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.render("Auth/cadastro", { erroMessage: "Este email já está cadastrado." });
        }

        const newUser = new User({ nome, email, senha });
        await newUser.save();

        console.log("Usuário inserido com sucesso no MongoDB!");
        req.session.username = newUser.nome;
        req.session.userId = newUser._id;
        return res.redirect("/home"); 

    } catch (err) {
        console.error("Erro ao inserir usuário no MongoDB:", err);
        res.status(500).render("Auth/cadastro", { erroMessage: "Erro interno ao cadastrar usuário." });
    }
};

exports.recuperar = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.render("Auth/recuperacao", { erroMessage: "Todos os campos são obrigatórios." });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if(!user){
            console.log("Endereço de email não encontrado!")
            return res.render("Auth/recuperacao", { erroMessage: "Usuário não encontrado" });
        }

        user.senha = senha;
        await user.save();

        console.log("Senha recuperada com sucesso!")
        res.redirect("/")

    } catch (err) {
        console.error("Erro ao recuperar senha", err);
        res.status(500).render("Auth/recuperacao", { erroMessage: "Erro interno ao recuperar senha." });
    }
};