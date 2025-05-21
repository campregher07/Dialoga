const express = require('express');
const router = express.Router();
const diaryController = require('../Controllers/diaryController');

router.get('/DiarioEmocional', (req, res) => {
    const { username, userId } = req.session;
    res.render('Diary/Diario', { username, userId });
});


router.post('/registrarDiario', diaryController.registrar);
router.get('/LerDiario', diaryController.listar);

module.exports = router;
