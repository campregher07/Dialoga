const express = require('express');
const router = express.Router();
const communityController = require('../Controllers/communityController');


router.get("/Comunidade", communityController.ler);
router.post("/Postar", communityController.escrever);
router.post("/curtir", express.json(), communityController.toggleLike);
router.post("/comentar", express.json(), communityController.comentar);
router.get("/comentarios/:postId", communityController.buscarComentarios);


module.exports = router;

