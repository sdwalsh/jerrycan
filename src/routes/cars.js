// Main router file
// Third party imports
const json = require('koa-json');
const assert = require('better-assert');
const Router = require('koa-router');
const jsonwt = require('jsonwebtoken');

// Local imports
const config = require('../config');
const db = require('../db');

const router = new Router();

router.get('/cars', async(ctx) => {
  user = ctx.state.user;
  ctx.assert(user, 401);
  cars = await db.cars.findCarsByUser(user);
  ctx.body = cars;
});

router.delete('/cars/:uuid', async(ctx) => {
  ctx.validateParam('uuid')
    .required('uuid of car required')
    .isUuid();
  user = ctx.state.user;
  ctx.assert(user, 401);

  const car = await db.cars.deleteCar(ctx.vals.uuid);

  if (car) {
    ctx.response.status = 200;
  } else {
    ctx.response.status = 400;
  }
});

router.put('/cars/:uuid', async(ctx) => {
  ctx.validateParam('uuid')
    .required('uuid of car required')
    .isUuid();
  ctx.validateBody('type')
    .required('type required')
    .isString()
    .trim();
  ctx.validateBody('model')
    .required('model required')
    .isString()
    .trim();
  ctx.validateBody('year')
    .required('year required')
    .isString()
    .trim();
  user = ctx.state.user;
  ctx.assert(user, 401);

  const car = await db.cars.updateCar(
    ctx.vals.uuid, ctx.vals.type, ctx.vals.model, ctx.vals.year
  );

  if (car) {
    ctx.body = car;
  } else {
    ctx.response.status = 400;
  }
});

router.post('/cars', async(ctx) => {
  ctx.validateBody('type')
    .required('type required')
    .isString()
    .trim();
  ctx.validateBody('model')
    .required('model required')
    .isString()
    .trim();
  ctx.validateBody('year')
    .required('year required')
    .isString()
    .trim();
  user = ctx.state.user;
  ctx.assert(user, 401);

  const car = await db.cars.createCar(
    user, ctx.vals.type, ctx.vals.model, ctx.vals.year
  );

  if (car) {
    ctx.body = car;
  } else {
    ctx.response.status = 400;
  }
});

module.exports = router;
