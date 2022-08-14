const mqtt = require('mqtt');
require('dotenv').config();
const ESPs = require ('../../models/esp.model');
const ESPData = require ('../../models/espData.model');
const User = require('../../models/user.model');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = process.env.MQTT_HOST;
    this.port = process.env.MQTT_PORT;
    //this.username = process.env.MQTT_USERNAME; // mqtt credentials if these are needed to connect
    //this.password = process.env.MQTT_PASSWORD;
  }
 
  connect() {
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

    this.mqttClient.on('message', (topic, message) => {
      console.log(`[RECEIVED MESSAGE] Topic: ${topic} / Message: ${message.toString()}`);

      if (topic === 'easywatering/data') {
        // Call method to parse data and store in DB;
        this.#processMessage(message.toString());
      }
    });

    this.mqttClient.on('close', () => {
      console.log('Disconnected from MQTT.');
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    console.log(`[SENT MESSAGE] Topic: ${topic} | Message: ${message.toString()}`);
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

  /*
  * Receives: 
  * Data: Unparsed ESP sensor reading as raw JSON String with {temp, umid, soil, id})
  * 
  * Returns:
  * Nothing
  */
  async #processMessage(Data) {
    var obj = JSON.parse(Data.toString());
    console.log('[JSON DATA]:',obj)
    try {
      if (obj && obj.id) {
        const esp = await ESPs.findOne({where: {
          id: obj.id,
          status: true,
        },
          include: { 
            model: User, 
            as: 'user',
            attributes: ['id', 'full_name', 'email']
          },
      });
  
        if (esp) {
          // console.log(esp.toJSON());
          await this.#saveData(obj, esp.toJSON());
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log("Error finding ESP: ", error.message);
    }
  }

  /*
  * Receives: 
  * Data: Parsed ESP sensor reading as OBJ with {temp, umid, soil, id})
  * ESP: ESP entity with related User
  * 
  * Returns:
  * Nothing
  */
  async #saveData(Data, ESP) {
    try {
      if (Data && ESP.id) {
        const bulkDataArr = [];

        Object.entries(Data).forEach(([key, value]) => {
          switch(key) {
            case 'temp':
              var newReading = {
                value: value,
                type: 1,
                desc: 'Air Temperature',
                created_at: Date.now(),
                esp_id: Data.id
              };

              bulkDataArr.push(newReading);
              break;
            case 'umid':
              var newReading = {
                value: value,
                type: 2,
                desc: 'Air Humidity',
                created_at: Date.now(),
                esp_id: Data.id
              };

              bulkDataArr.push(newReading);
              break;
            case 'soil':
              var newReading = {
                value: value,
                type: 3,
                desc: 'Soil Moisture',
                created_at: Date.now(),
                esp_id: Data.id
              };

              bulkDataArr.push(newReading);
              break;
            default:
              break;
          }
        })

        const result = await ESPData.bulkCreate(bulkDataArr);

        if (result) {
          console.log("Sucessfully inserted for ESP: ", ESP.id);
          // console.log(result);
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log("Error saving data: ", error.message);
    }
  }
}

module.exports = MqttHandler;