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
 * @return {Void}
 */
function loadCar() {
    return async(ctx, next) => {
        ctx.validateParam('car_uuid');
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
    cars = await db.cars.findCarsByUser(user);
    ctx.body = cars;
});

router.delete('/cars/:car_uuid/logs/:uuid', async(ctx) => {
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
