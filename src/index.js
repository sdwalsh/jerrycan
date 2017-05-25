// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-better-body');

// Session
const session = require('koa-session-redis');
// app.keys = ['keys here'];

// Use Google OAuth for authentication
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const db = require('./db');
const routes = require('./routes');
const config = require('./config');

const app = new Koa();

// Session configuration using Redis
// Sessions will remain for 60 minutes - 3600 seconds
app.use(session({
    store: {
      host: config.REDIS || '127.0.0.1',
      port: config.REDIS_PORT || '6379',
      ttl: 3600,
    },
  },
));

passport.use(new GoogleStrategy({
    consumerKey: config.GOOGLE_CONSUMER_KEY,
    consumerSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: "https://" + config.HOSTNAME + "/auth/google/callback"
  },
  async function(token, tokenSecret, profile, done) {
      user = await db.createUser(profile.id, profile.name, profile.emails);
      return done(err, user);
  }
));

//app.use(require('../routes').routes());
app.use(routes.routes());
app.start = function() {
  app.listen(3000);
}

module.exports = app;