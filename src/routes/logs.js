// Main router file
// Third party imports
// const json = require('koa-json');
// const assert = require('better-assert');
const Router = require('koa-router');
// const jsonwt = require('jsonwebtoken');
const winston = require('winston');

// Local imports
const config = require('../config');
const db = require('../db');

const router = new Router();

/**
 * loadCar determines if a car is owned by the user supplied
 * by the jsonwebtoken (middleware places user in ctx.state.user)
 * car data is stored in ctx.state.car
 * @return {Void}
 */
function loadCar() {
  return async(ctx, next) => {
    userOwnedCars = await db.cars.carsOwnedByUser(ctx.state.user.data);
    winston.log(userOwnedCars);
    ctx.assert(userOwnedCars.contains(ctx.vals.car_uuid), 404);
    ctx.state.cars = await db.cars.isCarOwnedByUser(ctx.vals.car_uuid,
                                                    ctx.state.user.data);
    await next();
  };
}

/**
 * loadLogs expects ctx.state.user and ctx.vals.car_uuid both set by previous
 * middleware in order to correctly return logs, otherwise 404
 * populates ctx.vals.car_uuid.logs
 * @param {Integer} rowBegin // not implemented
 * @param {Integer} rowEnd // not implemented
 * @return {Void}
 */
function loadLogs() {
  return async(ctx, next) => {
    ctx.vals.logs = await db.logs.findLogsByCar(ctx.vals.car_uuid);
    await next();
  };
}

router.get('/cars/:car_uuid/', async(ctx) => {
  ctx.validateParam('car_uuid')
      .required('car uuid required')
      .isUuid();
  user = ctx.state.user.data;
  console.log(user);
  loadCar();
  console.log(ctx.state.car);
  loadLogs();
  console.log(ctx.state.logs);
  ctx.body = ctx.vals.logs;
});

router.post('/cars/:car_uuid', async(ctx) => {
  ctx.validateParam('car_uuid')
      .required('car uuid required')
      .isUuid();
  user = ctx.state.user;
  ctx.assert(user, 401);
  loadCar();
});

router.delete('/cars/:car_uuid/:uuid', async(ctx) => {
  ctx.validateParam('car_uuid')
      .required('car uuid required')
      .isUuid();
  ctx.validateParam('uuid')
      .required('uuid of log required')
      .isUuid();
  user = ctx.state.user.data;
  ctx.assert(user, 404);
  loadCar();
  /**
   * Logs will only be deleted if user, car, and log uuids
   * match in the table
   */
  log = db.logs.deleteLog(ctx.vals.uuid, user, ctx.state.car);
  ctx.assert(log, 401);
  return ctx.status = 200;
});

module.exports = router;
