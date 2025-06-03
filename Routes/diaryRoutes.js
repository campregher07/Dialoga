const express = require('express');
const router = express.Router();
const diaryController = require('../Controllers/diaryController');

router.get('/DiarioEmocional', (req, res) => {
    if (typeof req.session.userId == undefined || req.session.userId == null) {
        return res.redirect('/');
    }
    const { username, userId } = req.session;
    res.render('Diary/Diario', { username, userId, currentPage: 'diary' });
});


router.post('/registrarDiario', diaryController.registrar);
router.get('/LerDiario', diaryController.listar);
router.post('/BuscarDiario', diaryController.search);

module.exports = router;
