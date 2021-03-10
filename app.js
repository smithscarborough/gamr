const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const es6Renderer = require('express-es6-template-engine');
const SequelizeStore = require('connect-session-sequelize')(session.Store); // note: SequelizeStore is capitalized b/c it is actually a class, which we will be able to use
const db = require('./models');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gamesRouter = require('./routes/games');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const store = new SequelizeStore({ db: db.sequelize })
app.use(
    session({
        secret: 'secret', // used to sign the cookie
        resave: false, // update session even w/ no changes
        saveUninitialized: true, // always create a session
        cookie: {
            secure: false, // true: only accept https reqs (note: it takes a lot of work to set up an HTTPS certificate for your development environment on your own, so setting this to false is the easiest way to do this)
            maxAge: 2592000, // time in seconds (the age...this equates to 30 days, meaning it will keep you logged in for 30 days after your last request)
        },
        store, // note: this is the same as writing this store: store (if the variable and key name are the same, you can just write it once)
    })
);
store.sync();
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter);

module.exports = app;
