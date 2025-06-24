const Diary = require("../models/Diary"); 
const mongoose = require("mongoose");

exports.registrar = async (req, res) => {
    const { texto, humor } = req.body;
    const userId = req.session.userId; 


    if (!texto || !humor) {
        console.error("Texto e humor são obrigatórios.");
        return res.redirect("/DiarioEmocional"); 
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("ID de usuário inválido na sessão.");
        return res.status(401).redirect("/"); 
    }

    try {
        await Diary.create({
            userId: userId, 
            texto: texto,
            humor: humor
        });

        console.log("Registro do diário salvo com sucesso no MongoDB Atlas!");
        res.redirect("/LerDiario"); 

    } catch (err) {
        console.error("Erro ao registrar diário no MongoDB:", err);
        const { username } = req.session;
        res.status(500).render("Diary/Diario", { 
            username, 
            userId, 
            currentPage: "diary", 
            erroMessage: "Erro interno ao salvar registro." 
        });
    }
};

exports.listar = async (req, res) => {
    const userId = req.session.userId;
    const username = req.session.username;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("ID de usuário inválido na sessão ao listar.");
        return res.status(401).redirect("/");
    }

    try {
        const resultados = await Diary.find({ userId: userId }).sort({ date: -1 }); 

        res.render("Diary/ListaDiario", { 
            diarios: resultados, 
            username, 
            currentPage: "diary" 
        });

    } catch (error) {
        console.error("Erro ao buscar diários:", error);
        // Corrigir o caminho da view no erro
        res.status(500).render("Diary/ListaDiario", { 
            diarios: [], 
            username, 
            currentPage: "diary",
            erroMessage: "Erro ao carregar seus registros."
        }); 
    }
};

exports.search = async (req, res) => {
    const userId = req.session.userId;
    const username = req.session.username;
    const { humor } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("ID de usuário inválido na sessão ao buscar.");
        return res.status(401).redirect("/");
    }

    try {
        const query = { userId: userId };
        if (humor) {
            query.humor = humor; 
        }


        const resultados = await Diary.find(query).sort({ date: -1 });

        res.render("Diary/ListaDiario", { 
            diarios: resultados, 
            username, 
            currentPage: "diary",
            selectedHumor: humor 
        });

    } catch (error) {
        console.error("Erro ao buscar diários por humor:", error);
        res.status(500).render("Diary/ListaDiario", { 
            diarios: [], 
            username, 
            currentPage: "diary",
            erroMessage: "Erro ao buscar registros."
        });
    }
};
