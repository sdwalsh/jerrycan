// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-better-body');
let router = require('loa-better-router')().loadMethods();

// Use Google OAuth for authentication
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

const db = require('../db');
const routes = require('./routes');
const config = require('./config');

const app = new Koa();

passport.use(new GoogleStrategy({
    consumerKey: config.GOOGLE_CONSUMER_KEY,
    consumerSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: "https://" + config.HOSTNAME + "/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      db.findOrCreateUser({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
  }
));

app.use(require('./routes').routes());

app.listen(3000);

module.exports = app;