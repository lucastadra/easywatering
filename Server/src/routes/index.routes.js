var express = require('express');
const routes = express.Router();
// import usersRouter from './bovinos.routes';
var mqttRouter = require('./mqtt.routes')
var authRouter = require('./auth.routes')

// routes.use('/users', usersRouter);
routes.use('/auth', authRouter);
routes.use('/mqtt', mqttRouter);

module.exports = routes;