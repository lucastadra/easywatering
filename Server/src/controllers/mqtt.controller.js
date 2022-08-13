const mqttHandler = require('../handlers/mqtt/mqttHandler');

const mqttClient = new mqttHandler();
mqttClient.connect();

// Routes
exports.Pub = async (req, res) => {
    try{
        mqttClient.sendMessage(req.body.topic, req.body.message);
        res.status(200).send({message: `Published message: ${req.body.message} to topic ${req.body.topic}.`});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.Sub = async (req, res) => {
    try {
        console.log(req.body.topic);
        mqttClient.subscribe(req.body.topic);
        res.status(200).send({message: `Subscribed to topic: ${req.body.topic}`});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.Unsub = async (req, res) => {
    try {
        mqttClient.unsubscribe(req.body.topic);
        res.status(200).send({message: `Unsubscribed from topic: ${req.body.topic}`});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
