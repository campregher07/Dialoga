const mongoose = require("mongoose");
const Report = require('../models/Report'); 

exports.Denunciar = async (req, res) => {
    const { anonimo, tipoDenuncia, ocorrido  } = req.body;
    const { username } = req.session;

    if (!ocorrido || ocorrido.trim() === '') {
        console.log("Preencha todos os campos");
        return res.render("Reports/denuncias", { 
            erroMessage: "Preencha todos os campos", 
            username, 
            currentPage: "report" 
        });
    }

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
        await Report.create(newReport);

        console.log("Registro do diário salvo com sucesso no MongoDB Atlas!");
        res.redirect("/Denuncias"); 

    } catch (err) {
        console.error("Erro ao registrar denúncia no MongoDB:", err);
        res.status(500).render("Reposts/denuncias", { 
            username, 
            currentPage: "report", 
            erroMessage: "Erro interno ao salvar denúncia." 
        });
    }
};
