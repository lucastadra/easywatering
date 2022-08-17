const ESP = require('../models/esp.model');
const ESPData = require('../models/espData.model');
const Users = require("../models/user.model");
require('dotenv').config();

exports.GetById = async (req, res) => {
  try {
    if (!req.userId) {
      res.status(404).send({ message: "User ID not provided." });
    }

    if (!req.params.dataId) {
      res.status(404).send({ message: "Data ID not provided." });
    }

    const user = await Users.findOne({ where: { id: req.userId } })

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (isNaN(parseInt(req.params.dataId, 10))) {
      res.status(404).send({ message: "Data ID is not valid." });
    }

    const data = await ESPData.findByPk(req.params.dataId);

    if (!data) {
      return res.status(404).send({ message: "Data not found." });
    }

    const esp = await ESP.findByPk(data.esp_id);

    if (esp.user_id != user.id) {
      return res.status(403).send({ message: "User not authorized to view ESP Data." });
    }

    res.status(200).send({ data });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.GetByESP = async (req, res) => {
  try {
    if (!req.userId) {
      res.status(404).send({ message: "User ID not provided." });
    }

    if (!req.params.espId) {
      res.status(404).send({ message: "ESP ID not provided." });
    }
    
    if (isNaN(parseInt(req.params.espId, 10))) {
      res.status(404).send({ message: "ESP ID is not valid." });
    }

    const user = await Users.findOne({ where: { id: req.userId } })

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const esp = await ESP.findByPk(req.params.espId);

    if (!esp) {
      return res.status(404).send({ message: "ESP not found." });
    }

    if (esp.user_id != user.id) {
      return res.status(403).send({ message: "User not authorized to view ESP Data." });
    }

    const data = await ESPData.findAll({
      where: {
        esp_id: esp.id
      }
    })

    if (!data) {
      return res.status(404).send({ message: "Data not found." });
    }

    res.status(200).send({ data });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.GetByType = async (req, res) => {
  try {
    if (!req.userId) {
      res.status(404).send({ message: "User ID not provided." });
    }

    if (!req.params.espId) {
      res.status(404).send({ message: "ESP ID not provided." });
    }

    if (!req.params.typeId) {
      res.status(404).send({ message: "Type ID not provided." });
    }

    if (isNaN(parseInt(req.params.typeId, 10))) {
      // TODO: Change to shared types class
      const validTypes = [1, 2, 3];

      const parsedTypeId = parseInt(req.params.typeId, 10);

      if (validTypes.indexOf(parsedTypeId) === -1) {
        res.status(404).send({ message: "Type ID is not valid." });
      }
    }

    const user = await Users.findOne({ where: { id: req.userId } })

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const esp = await ESP.findByPk(req.params.espId);

    if (!esp) {
      return res.status(404).send({ message: "ESP not found." });
    }

    if (esp.user_id != user.id) {
      return res.status(403).send({ message: "User not authorized to view ESP Data." });
    }

    const data = await ESPData.findAll({
      where: {
        esp_id: esp.id,
        type: parseInt(req.params.typeId, 10)
      }
    })

    if (!data) {
      return res.status(404).send({ message: "Data not found." });
    }

    res.status(200).send({ data });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};