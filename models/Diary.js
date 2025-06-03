const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        index: true
    },
    texto: {
        type: String,
        required: true,
        trim: true
    },
    humor: {
        type: String,
        required: true,
        trim: true,
        enum: ["Feliz", "Contente", "Neutro", "Ansioso", "Triste", "Irritado"]
    },
    date: {
        type: Date,
        default: Date.now 
    }
}, {
    timestamps: true 
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;
