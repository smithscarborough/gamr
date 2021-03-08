var express = require('express');
const db = require('../models');
var router = express.Router();

/* GET games page. */
router.get('/', function(req, res, next) {
    db.Game.findAll()
        .then(games => {
            res.json(games);
        })
});

module.exports = router;