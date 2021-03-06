// Main router file
// Third party imports
const json = require('koa-json');
const assert = require('better-assert');
const Router = require('koa-router');
const router = new Router();
const jsonwt = require('jsonwebtoken');

// Local imports
const config = require('../config');
const db = require('../db');

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
router.get('/public', async(ctx) => {
    ctx.assert(config.NODE_ENV === 'development', 404);
    ctx.cookies.set = ('Test', 'Test');
    ctx.body = {test: 'text'};
});

router.get('/public/test', async(ctx) => {
    ctx.assert(config.NODE_ENV === 'development', 404);
    await ctx.set({
      'Authorization': 'Bearer ' + jsonwt.sign('test', 'filler'),
    });
    ctx.body = 'box';
});

router.get('/public', async(ctx) => {
    ctx.assert(config.NODE_ENV === 'development', 404);
    ctx.cookies.set = ('Test', 'Test');
    ctx.body = {test: 'text'};
});

module.exports = router;
