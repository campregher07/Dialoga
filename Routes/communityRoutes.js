const express = require('express');
const router = express.Router();
const communityController = require('../Controllers/communityController');


router.get("/Comunidade", communityController.ler);
router.post("/Postar", communityController.escrever);

module.exports = router;