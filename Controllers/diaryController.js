const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/DialogaDB";
const client = new MongoClient(uri);

exports.registrar = async (req, res) => {
    const { texto } = req.body;
    const { humor } = req.body;
    const userId = req.session._id;
    console.log("Registrar: ",req.session)

    const novoRegistro = {
        userId: userId,
        texto,
        humor,
        date: new Date()
    };

    try {
        await client.connect();
        const diario = client.db("DialogaDB").collection("diario");
        await diario.insertOne(novoRegistro);
        res.redirect("/LerDiario");
    } catch (err) {
        console.error("Erro no MongoDB:", err);
        res.status(500).send("Erro interno");
    } finally {
        await client.close();
    }
};

exports.listar = async (req, res) => {
    const userId = req.session._id;
    const username = req.session.username;

    console.log("Listar: ", req.session)
    try {
        await client.connect(); 
    
        const resultados = await client.db("DialogaDB")
            .collection("diario")
            .find({ userId: userId})
            .sort({date: -1})
            .toArray();

        res.render("Diary/ListaDiario", { diarios: resultados, username, currentPage: 'diary' });
    
    } catch (error) {
        console.error("Erro ao buscar diários:", error);
        res.render("Denuncias/ListaDiario", { diarios: [], username });
    } finally {
        await client.close();
    }
};

exports.search = async (req, res) => {
    const userId = req.session._id;
    // if (!userId) {
    //     return res.status(401).send("Usuário não autenticado");
    // }
    const username = req.session.username;
    const { humor } = req.body
    console.log("search", "Session: ", req.session, "Body: ",req.body)

    try {
        await client.connect(); 
    
        let resultados = await client.db("DialogaDB")
            .collection("diario")
            .find({ userId: userId})
            .sort({date: -1})
            .toArray();
        if (humor) {
            resultados = resultados.filter(diario => diario.humor === humor)
        }
        res.render("Diary/ListaDiario", { diarios: resultados, username, currentPage: 'diary' });
    
    } catch (error) {
        console.error("Erro ao buscar diários:", error);
        res.render("Diary/ListaDiario", { diarios: [], username });
    } finally {
        await client.close();
    }


};

