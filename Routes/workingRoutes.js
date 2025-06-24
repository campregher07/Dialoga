const express = require('express');
const router = express.Router();

router.get("/Andamento", function(req,res) {
    res.render("Working/Andamento", {currentPage: 'Andamento'});
});

module.exports = router;