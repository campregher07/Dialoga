const express = require('express');
const router = express.Router();

// Rota da página inicial do sistema (home após login)
router.get('/home', (req, res) => {
  const username = req.session.username || "Usuário";
  res.render('Home/home', { username });
});

module.exports = router;