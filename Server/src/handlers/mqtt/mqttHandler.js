const mqtt = require('mqtt');
require('dotenv').config()

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = process.env.MQTT_HOST;
    this.port = process.env.MQTT_PORT;
    //this.username = process.env.MQTT_USERNAME; // mqtt credentials if these are needed to connect
    //this.password = process.env.MQTT_PASSWORD;
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect('mqtt://' + this.host, this.port,
      //{ username: this.username, password: this.password }
    );

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT.');
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('easywatering/data', {qos: 0});
    //this.mqttClient.subscribe('easywatering/signal', {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      //this.#processMessage();
      console.log(`New message: ${message.toString()} from topic: ${topic}`);
      //TODO: process and save esp8266 data;
    });

    this.mqttClient.on('close', () => {
      console.log('Disconnected from MQTT.');
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    this.mqttClient.publish(topic.toString(), message.toString());
  }

  subscribe(topic, _qos) {
    this.mqttClient.subscribe(topic, {qos: _qos || 0});
  }

  unsubscribe(topic) {
    this.mqttClient.unsubscribe(topic, console.log, err => {
      if (err)
        console.log('Error while unsubscribing: ', err);
    });
  }

  // Private method for processing mqtt sensor data
  #processMessage() {
    return null;
  }
}

module.exports = MqttHandler;