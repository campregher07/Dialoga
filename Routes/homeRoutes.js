const express = require('express');
const router = express.Router();


router.get('/home', (req, res) => {
  const username = req.session.username || "Usuário";
  res.render('Home/home', { username, currentPage: 'home' });
});

module.exports = router;