const mongoose = require("mongoose");
const Post = require('../models/Community'); 
const Like = require('../models/Like')
const Comment = require('../models/Comment');


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
        const posts = await Post.find().sort({ createdAt: -1 }).lean();

        for (let post of posts) {
        post.totalLikes = await Like.countDocuments({ postId: post._id });
        post.userCurtiu = await Like.exists({ postId: post._id, userId: req.session.userId });
        }

        const comentarios = await Comment.find().sort({ createdAt: 1 }).lean();
        const postsComComentarios = posts.map(post => {
            post.comentarios = comentarios.filter(c => c.postId.toString() === post._id.toString());
            return post;
        });

        res.render("Community/Comunidade", { 
            userId,
            post: postsComComentarios,
            comentarios: comentarios,  
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

exports.toggleLike = async (req, res) => {
    const { userId } = req.session;
    const { postId } = req.body;

    try {
        const likeExistente = await Like.findOne({ userId, postId });

        let curtiu;

        if (likeExistente) {
            // Já curtiu → descurtir
            await Like.deleteOne({ userId, postId });
            curtiu = false;
        } else {
            // Ainda não curtiu → curtir
            await Like.create({ userId, postId });
            curtiu = true;
        }

        const totalLikes = await Like.countDocuments({ postId });

        return res.json({ curtiu, totalLikes });

    } catch (error) {
        console.error("Erro no toggle de curtida:", error);
        res.status(500).json({ erro: "Erro ao alternar curtida." });
    }
};

exports.comentar = async (req, res) => {
    const { userId, username } = req.session;
    const { postId, texto } = req.body;

    try {
        const novoComentario = await Comment.create({ postId, userId, username, texto });

        res.json({
            sucesso: true,
            comentario: {
                username: novoComentario.username,
                texto: novoComentario.texto,
                createdAt: new Date(novoComentario.createdAt).toLocaleString('pt-BR')
            }
        });
    } catch (error) {
        console.error("Erro ao comentar:", error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao comentar.' });
    }
};
