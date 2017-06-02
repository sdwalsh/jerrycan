// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-better-body');
const jwt = require('koa-jwt');
const jsonwt = require('jsonwebtoken');
const unless = require('koa-unless');

const Router = require('koa-router');
const auth = new Router();

// Use Google OAuth for authentication
const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Local imports
const db = require('./db');
const routes = require('./routes');
const config = require('./config');

const app = new Koa();

// require jwt unless the path is public
//app.use(jwt({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/] }));

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CONSUMER_KEY,
    clientSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://" + config.HOSTNAME + "/auth/google/callback"
  },
  async function(token, tokenSecret, profile, done) {
    user = await db.findUserG(profile.id)
    if (user.uuid !== 'undefined') {
      return done(err, user);
    } 
    else {
      user = await db.createUser(profile.id, profile.name, profile.emails);
      return done(err, user);
    }
}));

auth.get('/auth/google',
  passport.authenticate('google', 
  { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

auth.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (ctx) => {
    await ctx.set({'Authorization': 'Bearer ' + jsonwt.sign(ctx.state.user.uuid, 'secret')})
});

// Custom 401 handling if you don't want to expose koa-jwt errors to users
/*app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});*/

//app.use(require('../routes').routes());
app.use(auth.routes());
app.use(routes.routes());
app.start = function() {
  app.listen(3000);
}

module.exports = app;