var express = require('express');
const mqttRouter = express.Router();

const mqttHandler = require('../handlers/mqtt/mqttHandler');

const mqttClient = new mqttHandler();
mqttClient.connect();

// Routes
mqttRouter.post("/pub", function(req, res) {
  mqttClient.sendMessage(req.body.topic, req.body.message);
  res.status(200).send(`Published message: ${req.body.message} to topic ${req.body.topic}.`);
});

mqttRouter.post("/sub", function(req, res) {
  mqttClient.subscribe(req.body.topic);
  res.status(200).send("Subscribed to topic: ", req.body.topic);
});

mqttRouter.post("/unsub", function(req, res) {
  mqttClient.unsubscribe(req.body.topic);
  res.status(200).send("Unsubscribed from topic: ", req.body.topic);
});
// TODO: MQTT Controller instead of calling handler directly

module.exports = mqttRouter;