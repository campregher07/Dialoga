const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error('Erro: Variável de ambiente MONGODB_URI não definida.');
    process.exit(1);
}

async function conectarMongo() {
    try {
        await mongoose.connect(dbURI);
        console.log('Conectado ao MongoDB Atlas com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB Atlas:', err);
    }
}

module.exports = conectarMongo;
