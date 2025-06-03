const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/DialogaDB";
const client = new MongoClient(uri);

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
        await client.connect();
        const report = client.db("DialogaDB").collection("reports");
        await report.insertOne(newReport);
        res.redirect("/Denuncias");
    } catch (err) {
        console.error("Erro no MongoDB:", err);
        res.status(500).send("Erro interno");
    } finally {
        await client.close();
    }

};
