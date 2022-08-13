var express = require('express');
const routes = express.Router();
// import usersRouter from './bovinos.routes';
var mqttRouter = require('./mqtt.routes')
var authRouter = require('./auth.routes')

// routes.use('/users', usersRouter);
routes.use('api/auth', authRouter);
routes.use('api/mqtt', mqttRouter);

module.exports = routes;