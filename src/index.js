// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-better-body');
const jwt = require('koa-jwt');
const jsonwt = require('jsonwebtoken');
const unless = require('koa-unless');
const logger = require('koa-logger');

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

// development debugging tools
if(config.NODE_ENV === "development"){
  app.use(logger());
}

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CONSUMER_KEY,
    clientSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://" + config.HOSTNAME + "/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    db.findUserG(profile.id).then(
      function(user){
        return done(err, user);
      }
    )
    .catch(
      function(user){
        user = db.createUser(profile.id, profile.name.givenName, profile.emails);
        err = null;
        return done(err, user);
      }
    );

}));

auth.get('/auth/google',
  passport.authenticate('google', 
  { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

auth.get('/auth/google/callback',
  passport.authenticate('google', {
    session: false
  }),
  async (ctx) => {
    await ctx.state.user.then(
      async function(user){
        await ctx.cookies.set("authorization", jsonwt.sign(user.uuid, config.JWT_SECRET));
        ctx.response.status = 200;
      }
    )
    .catch(
      function() {
        ctx.response.status = 401;
      }
    )
});

//app.use(home.routes());
app.use(auth.routes());

// require jwt unless the path is public
app.use(jwt({ 
  secret: config.JWT_SECRET,
  cookie: 'authorization'
}).unless({ path: [/^\/auth/] }));
app.use(routes.routes());
app.start = function() {
  app.listen(3000);
}

module.exports = app;