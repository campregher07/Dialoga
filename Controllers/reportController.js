const mongoose = require("mongoose");
const Report = require('../models/Report'); 

exports.Denunciar = async (req, res) => {
    const { anonimo, tipoDenuncia, ocorrido  } = req.body;
    const { username } = req.session;

    const newReport = {
        tipoDenuncia,
        ocorrido,
        data: new Date().toLocaleDateString("pt-br"),
    };

    if (anonimo !== '1') {
        newReport.nome = username;
    } else {
        newReport.anonimo = true;
    }

    try {
        await Diary.create(newReport);

        console.log("Registro do diário salvo com sucesso no MongoDB Atlas!");
        res.redirect("/DiarioEmocional"); 
    } catch (err) {
        console.error("Erro ao registrar denúncia no MongoDB:", err);
        res.status(500).render("Reposts/denuncias", { 
            username, 
            userId, 
            currentPage: "report", 
            erroMessage: "Erro interno ao salvar denúncia." 
        });
    }
};
