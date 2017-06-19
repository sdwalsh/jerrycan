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

/**
 * loadCar determines if a car is owned by the user supplied
 * by the jsonwebtoken (middleware places user in ctx.state.user)
 * car data is stored in ctx.state.car
 * @return {Void}
 */
function loadCar() {
  return async(ctx, next) => {
      ctx.validateParam('car_uuid')
          .required('car uuid required')
          .isUuid();
      const car = await db.cars.isCarOwnedByUser(ctx.vals.car_uuid,
                                            ctx.state.user);
      assert(car, 404);
      ctx.state.car = car;
      await next();
  };
}

/**
 * loadLogs expects ctx.state.user and ctx.vals.car_uuid both set by previous
 * middleware in order to correctly return logs, otherwise 404
 * populates ctx.vals.car_uuid.logs
 * @param {Integer} rowBegin // not implmented
 * @param {Integer} rowEnd // not implmented
 * @return {Void}
 */
function loadLogs() {
  return async(ctx, next) => {
      const logs = await db.logs.findLogsByCar(ctx.vals.car_uuid);
      assert(logs, 404);
      ctx.vals.logs = logs;
      await next();
  };
}

router.get('/cars/:car_uuid/', async(ctx) => {
  user = ctx.state.user;
  ctx.assert(user, 401);
  loadCar();
  loadLogs();
  ctx.body = ctx.vals.logs;
});

router.post('/cars/:car_uuid', async(ctx) => {
  user = ctx.state.user;
  ctx.assert(user, 401);
  loadCar();
});

router.delete('/cars/:car_uuid/:uuid', async(ctx) => {
  ctx.validateParam('uuid')
      .required('uuid of log required')
      .isUuid();
  user = ctx.state.user;
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
