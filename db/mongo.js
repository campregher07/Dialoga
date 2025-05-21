// db/mongo.js
const mongoose = require('mongoose');

async function conectarMongo() {
    try {
        await mongoose.connect('mongodb://localhost:27017/DialogaDB');
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', err);
    }
}

module.exports = conectarMongo;
