const express = require('express');
const router = express.Router();


router.get('/home', (req, res) => {
      if (typeof req.session.userId == undefined || req.session.userId == null) {
        return res.redirect('/');
    }

  const username = req.session.username || "Usuário";
  res.render('Home/home', { username, currentPage: 'home' });
});

module.exports = router;