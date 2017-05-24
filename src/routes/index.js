// Main router file
const json = require('koa-json');
const Router = require('koa-router');
const router = new Router();
const assert = require('better-assert');

const config = require('../config');

/*
router.get('/', async (ctx) => {
  await ctx.render('homepage', {
    ctx,
    messages,
    recaptchaSitekey: config.RECAPTCHA_SITEKEY
  })
})
*/

// Test function for use during development
router.get('/', async (ctx) => {
    ctx.assert(config.NODE_ENV === 'development', 404)
    ctx.body = { test: "text" };
});

module.exports = router;