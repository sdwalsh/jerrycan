// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-body');
const jwt = require('koa-jwt');
const jsonwt = require('jsonwebtoken');
const unless = require('koa-unless');
const logger = require('koa-logger');
const bouncer = require('koa-bouncer');

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
if (config.NODE_ENV === 'development') {
  app.use(logger());
}

app.use(passport.initialize());
app.use(body());
app.use(bouncer.middleware());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CONSUMER_KEY,
    clientSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: 'http://' + config.HOSTNAME + '/auth/google/callback',
  },
  async function(token, tokenSecret, profile, done) {
    user = await db.findUserG(profile.id);
    if (user) {
      return done(null, user);
    } else {
      user = await db.createUser(profile.id, profile.displayName,
                                  profile.emails);
      return done(null, user);
    }
}));

auth.get('/auth/google',
  passport.authenticate('google',
  {scope: ['https://www.googleapis.com/auth/plus.login']})
);

auth.get('/auth/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  async(ctx) => {
    user = ctx.state.user;
    if (user) {
      await ctx.cookies.set(
        'authorization',
        jsonwt.sign({
          data: user.uuid,
        }, config.JWT_SECRET, {expiresIn: '1hr'}
        ));
      ctx.response.status = 200;
    } else {
      ctx.response.status = 401;
    }
});

// app.use(home.routes());
app.use(auth.routes());

// require jwt unless the path is public
app.use(jwt({
  secret: config.JWT_SECRET,
  cookie: 'authorization',
}).unless({path: [/^\/auth/]}));
app.use(routes.routes());
app.start = function() {
  app.listen(3000);
};

module.exports = app;
