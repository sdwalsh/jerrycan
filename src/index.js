// Environmental Configurations
require('dotenv').config();

// Load 3rd party libraries
const Koa = require('koa');
const body = require('koa-better-body');
let router = require('loa-better-router')().loadMethods();
const routes = require('./routes');


const app = new Koa();

app.use(require('./routes').routes());

app.listen(3000);

module.exports = app;