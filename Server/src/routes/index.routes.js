var express = require('express');
const routes = express.Router();

var mqttRouter = require('./mqtt.routes')
var authRouter = require('./auth.routes')
var dataRouter = require('./data.routes')
var harvestRouter = require('./harvest.routes')
var espRouter = require('./esp.routes');

routes.use('/auth', authRouter);
routes.use('/mqtt', mqttRouter);
routes.use('/data', dataRouter);
routes.use('/harvest', harvestRouter);
routes.use('/esp', espRouter);

module.exports = routes;