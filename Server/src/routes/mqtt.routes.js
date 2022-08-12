var express = require('express');
const mqttRoutes = express.Router();

const mqttHandler = require('../handlers/mqtt/mqttHandler');

const mqttClient = new mqttHandler();
mqttClient.connect();

// Routes
mqttRoutes.post("/mqtt/pub", function(req, res) {
  mqttClient.sendMessage(req.body.topic, req.body.message);
  res.status(200).send(`Published message: ${req.body.message} to topic ${req.body.topic}.`);
});

mqttRoutes.post("/mqtt/sub", function(req, res) {
  mqttClient.subscribe(req.body.topic);
  res.status(200).send("Subscribed to topic: ", req.body.topic);
});

mqttRoutes.post("/mqtt/unsub", function(req, res) {
  mqttClient.unsubscribe(req.body.topic);
  res.status(200).send("Unsubscribed from topic: ", req.body.topic);
});

module.exports = mqttRoutes;