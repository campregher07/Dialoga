const mongoose = require("mongoose");
const Post = require('../models/Community'); 

exports.escrever = async (req, res) => {
    const { texto } = req.body

    try{
    if(!texto){
        console.log("Texto não pode estar vazio")
        res.render("Community/Comunidade", {erroMessage: "Texto não pode ser vazio", currentPage: "community"})
    }

        await Post.create({
            texto: texto
        });

        console.log("Post feito com sucesso!")
        res.redirect("/Comunidade")
    }catch(err) {
        console.error("Erro ao registrar post no MongoDB:", err);
        res.status(500).render("Community/Comunidade", { 
            currentPage: "community",
            erroMessage: "Erro interno ao salvar post." 
        });
    }
};

exports.ler = async (req, res) => {
    if (typeof req.session.userId == "undefined" || req.session.userId == null) {
        return res.redirect('/');
    }

    const { username, userId } = req.session;

    try {
        const resultados = await Post.find().sort({ date: -1 });

        res.render("Community/Comunidade", { 
            username,
            userId,
            post: resultados, 
            currentPage: "community" 
        });

    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        res.status(500).render("Community/Comunidade", { 
            username,
            userId,
            post: [], 
            currentPage: "community",
            erroMessage: "Erro ao carregar os posts."
        }); 
    }
};