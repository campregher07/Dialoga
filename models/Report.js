const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    anonimo: {
        type: Number,
        default: false
    },
    nome: {
        type: String,
        trim: true
        // Não é obrigatório se for anônimo
    },
    tipoDenuncia: {
        type: Array,
        trim: true
    },
    ocorrido: {
        type: String,
        required: true,
        trim: true
    },
    // Poderiamos adicionar uma referência ao usuário que denunciou, se não for anônimo
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
