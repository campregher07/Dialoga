const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/reportController');

router.get("/Denuncias", function(req, res){
    res.render("Reports/Denuncias")
});

router.post('/reportController', reportController.Denunciar);

module.exports = router;