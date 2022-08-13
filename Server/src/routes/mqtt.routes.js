var express = require('express');
const mqttRouter = express.Router();
const mqttController = require('../controllers/mqtt.controller');

//TODO: Middleware for ESPs
mqttRouter.post('/pub', mqttController.Pub);
mqttRouter.post('/sub', mqttController.Sub);
mqttRouter.post('/unsub', mqttController.Unsub);

module.exports = mqttRouter;