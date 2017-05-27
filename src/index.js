// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-better-body');
const jwt = require('koa-jwt');
const jsonwt = require('jsonwebtoken');
const unless = require('koa-unless');

const Router = require('koa-router');
const router = new Router();

// Use Google OAuth for authentication
const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Local imports
const db = require('./db');
const routes = require('./routes');
const config = require('./config');

const app = new Koa();

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

// require jwt unless the path is public
app.use(jwt({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/] }));

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CONSUMER_KEY,
    clientSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: "https://" + config.HOSTNAME + "/auth/google/callback"
  },
  async function(token, tokenSecret, profile, done) {
      user = await db.createUser(profile.id, profile.name, profile.emails);
      jsonwt.sign({id: profile.id})
      return done(err, user);
  }
));

router.get('/auth/google',
  passport.authenticate('google', 
  { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (ctx) => {
    ctx.body = {
      token: jwt.sign()
    }
});

//app.use(require('../routes').routes());
app.use(routes.routes());
app.start = function() {
  app.listen(3000);
}

module.exports = app;