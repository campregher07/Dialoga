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
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        // Contar total de posts para calcular páginas
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        // Buscar posts com paginação
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Adicionar informações de likes para cada post
        for (let post of posts) {
            post.totalLikes = await Like.countDocuments({ postId: post._id });
            post.userCurtiu = await Like.exists({ postId: post._id, userId: req.session.userId });
        }

        res.render("Community/Comunidade", { 
            userId,
            post: posts,
            currentPage: "community",
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            }
        });

    } catch (error) {
        console.error("Erro ao buscar posts:", error);
        res.status(500).render("Community/Comunidade", { 
            username,
            userId,
            post: [], 
            currentPage: "community",
            erroMessage: "Erro ao carregar os posts.",
            pagination: {
                currentPage: 1,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
            }
        }); 
    }
};

// Nova função para buscar comentários de um post específico
exports.buscarComentarios = async (req, res) => {
    const { postId } = req.params;

    try {
        const comentarios = await Comment.find({ postId })
            .sort({ createdAt: 1 })
            .lean();

        res.json({
            sucesso: true,
            comentarios: comentarios
        });

    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        res.status(500).json({ 
            sucesso: false, 
            erro: "Erro ao carregar comentários." 
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
                _id: novoComentario._id,
                username: username,
                texto: novoComentario.texto,
                createdAt: new Date(novoComentario.createdAt).toLocaleString('pt-BR')
            }
        });
    } catch (error) {
        console.error("Erro ao comentar:", error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao comentar.' });
    }
};

