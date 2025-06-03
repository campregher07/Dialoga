const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/reportController');
const { report } = require('process');

router.get("/Denuncias", function(req, res){
        if (typeof req.session.userId == undefined || req.session.userId == null) {
        return res.redirect('/');
    }

    const { username } = req.session;
    res.render("Reports/denuncias", {username: username, currentPage: 'report'})
});

router.post('/reportController', reportController.Denunciar);

module.exports = router;