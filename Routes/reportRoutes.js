const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/reportController');
const { report } = require('process');

router.get("/Denuncias", function(req, res){
    const { username } = req.session;
    res.render("Reports/Denuncias", {username, currentPage: 'report'})
});

router.post('/reportController', reportController.Denunciar);

module.exports = router;