var express = require('express');
var router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll()
    .then(users => {
      res.json(users)
    })
});

router.post('/', (req, res) => {
  db.User.create({
    // all of the fields that go in here, are fields that go in the db:
    // create a user in the database:
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gamerTag: req.body.gamerTag,
  })
    .then(user => {
      // if successful, respond with user
      res.json(user);
    })
    .catch(error => {
      // if failed, return the error message(s)
      if (error.errors.length) {
        // try to get errors from sequelize
        res.json.json(error.errors.map(e => e.message))
      } else {
        // send back generic error otherwise:
        res.json({error: 'failed to create user'})
      }
    })
})

router.post('/register', async (req, res) => {
  // check the database to see if user exists
  const users = await db.User.findAll({
    where: {
      email: req.body.email
    }
  })
  // if user exists, send error
  if (users.length) {
    return res.status(422).json({ error: 'email already in use.' })
  }
  // check name, email, gamerTag, password
  // if not all data included, send error
  if (!req.body.email || !req.body.name || !req.body.gamerTag || !req.body.password) {
    return res.status(422).json({ error: 'please include all required fields' });
  }
  // hash password
  const hash = await bcrypt.hash(req.body.password, 10)
  // otherwise, create the user
  const newUser = await db.User.create({
    email: req.body.email,
    name: req.body.name,
    gamerTag: req.body.gamerTag,
    password: hash
  })
  res.json(newUser);
})

router.post('/login', async (req, res) => {
  // check for email + password
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({ error: 'please include all required fields' });
  }
  // get user from db (by email)
  const user = await db.User.findOne({
    where: {
      email: req.body.email
    }
  })
  // error if no user
  if (!user) {
    return res.status(404).json({ error: 'could not find user with that email' })
  }

  // compare user input for password to hash (the compare below will be a boolean, so it will return true or false)
  const match = await bcrypt.compare(req.body.password, user.password) 
  // return error if incorrect
  if (!match) {
    return res.status(401).json({ error: 'incorrect password' })
  }
  // login if correct
  res.json({ success: 'logged in!', user: user })
})

module.exports = router;
