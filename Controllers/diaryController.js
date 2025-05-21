const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/DialogaDB";
const client = new MongoClient(uri);

exports.registrar = async (req, res) => {
    const { texto, meuSlider } = req.body;
    const userId = req.session.userId;

    if (!texto || !meuSlider || !userId) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const novoRegistro = {
        userId: parseInt(userId),
        texto,
        intensidade: parseInt(meuSlider),
        date: new Date()
    };

    try {
        await client.connect();
        const diario = client.db("DialogaDB").collection("diario");
        await diario.insertOne(novoRegistro);
        res.redirect("/DiarioEmocional");
    } catch (err) {
        console.error("Erro no MongoDB:", err);
        res.status(500).send("Erro interno");
    } finally {
        await client.close();
    }
};

exports.listar = async (req, res) => {
    const userId = req.session.userId; 
    const username = req.session.username;
    
    try {
        await client.connect(); 
    
        const resultados = await client.db("DialogaDB")
            .collection("diario")
            .find({ userId: userId })
            .toArray();

        res.render("Diary/ListaDiario", { diarios: resultados, username });
    
    } catch (error) {
        console.error("Erro ao buscar diários:", error);
        res.render("Denuncias/ListaDiario", { diarios: [], username });
    } finally {
        await client.close();
    }
};