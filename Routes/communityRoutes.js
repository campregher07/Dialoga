const express = require('express');
const router = express.Router();
const communityController = require('../Controllers/communityController');

// router.get("/Comunidade", (req,res) => {
//     if (typeof req.session.userId == undefined || req.session.userId == null) {
//         return res.redirect('/');
//     }
//     const { username, userId } = req.session;
//     res.render('Community/Comunidade', { username, userId, currentPage: 'community'  });
// });

router.get("/Comunidade", communityController.ler);
router.post("/Postar", communityController.escrever);

module.exports = router;