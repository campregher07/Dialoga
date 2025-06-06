const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User', 
    //     required: true,
    //     index: true
    // }, Não sei ainda se vou usar o id
    texto: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
}, {
    timestamps: true 
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
