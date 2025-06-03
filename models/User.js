const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Middleware (hook) para fazer hash da senha ANTES de salvar no banco
userSchema.pre('save', async function(next) {
    // Só faz o hash se a senha foi modificada (ou é nova)
    if (!this.isModified('senha')) return next();

    try {
        // Gera o salt e faz o hash
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar a senha fornecida com a senha hashada no banco
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.senha);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
