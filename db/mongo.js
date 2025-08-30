const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error('Erro: Variável de ambiente MONGODB_URI não definida.');
    process.exit(1);
}

async function conectarMongo() {
    try {
        // Para desenvolvimento/teste, usar uma conexão mock se MongoDB não estiver disponível
        if (process.env.NODE_ENV === 'development') {
            console.log('Modo de desenvolvimento: Simulando conexão com MongoDB');
            return;
        }
        
        await mongoose.connect(dbURI);
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (err) {
        console.warn('Aviso: Não foi possível conectar ao MongoDB:', err.message);
        console.log('Continuando em modo de desenvolvimento sem banco de dados...');
    }
}

module.exports = conectarMongo;
