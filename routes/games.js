var express = require('express');
const db = require('../models');
var router = express.Router();
const checkAuth = require('../checkAuth')

/* GET games page. */
router.get('/', checkAuth, function(req, res, next) {
    if (!req.session.user) {
        return res.status(401).render('error', { locals: { error: 'not logged in' }})
    }


    db.Game.findAll()
        .then(games => {
            res.render('games', {
                // whatever data we put inside of this locals object, will become availabe inside the template
                locals: {
                    games
                }
            })
        })
});

module.exports = router;