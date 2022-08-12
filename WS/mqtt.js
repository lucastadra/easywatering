const mqtt = require('mqtt') 
require('dotenv').config() 


const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4) 
const client  = mqtt.connect(process.env.BROKER_URL, {clientId: clientId}); 