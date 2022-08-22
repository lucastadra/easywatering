// var express = require('express');
// const espRouter = express.Router();
// const espController = require('../controllers/esp.controller');
// const { authJwt } = require('../middlewares/index.middleware');

// espRouter.get('/', authJwt.verifyToken, espController.GetById);
// espRouter.get('/:espId', authJwt.verifyToken, espController.GetById);
// espRouter.get('/harvest/:harvestId', authJwt.verifyToken, espController.GetByHarvest);

// module.exports = espRouter;

const ESP = require('../models/esp.model');
const ESPData = require('../models/espData.model');
const Users = require("../models/user.model");
const Harvests = require("../models/harvest.model");
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

exports.GetAll = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).send({ message: "User ID not provided." });
        }

        const user = await Users.findOne({ where: { id: req.userId } })

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const esps = await ESP.findAll({
            where: {
                user_id: req.userId
            }
        });

        res.status(200).send({ esps });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.GetById = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).send({ message: "User ID not provided." });
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

        if (esp.user_id !== user.id) {
            return res.status(403).send({ message: "User not authorized to view ESP." });
        }

        res.status(200).send({ esp });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.GetByHarvest = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).send({ message: "User ID not provided." });
        }

        
        if (!req.params.harvestId) {
            res.status(404).send({ message: "Harvest ID not provided." });
        }

        if (isNaN(parseInt(req.params.harvestId, 10))) {
            res.status(404).send({ message: "Harvest ID is not valid." });
        }

        const harvest = await Harvests.findByPk(req.params.harvestId);

        if (!harvest) {
            return res.status(404).send({ message: "Harvest not found." });
        }

        const user = await Users.findOne({ where: { id: req.userId } })

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const esps = await ESP.findAll({
            where: {
                user_id: user.id,
                harvest_id: harvest.id
            }
        });

        res.status(200).send({ esps });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.Create = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).send({ message: "User ID not provided." });
        }

        const user = await Users.findOne({ where: { id: req.userId } })

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const esp = await ESP.create({
            id: uuidv4(),
            alias: req.body.alias,
            harvest_id: req.body.harvest_id,
            user_id: user.id,
            created_at: Date.now()
        });

        if (esp) {
            res.status(200).send({ esp, message: "ESP was created successfully!" });
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.Delete = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).send({ message: "User ID not provided." });
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

        if (esp.user_id !== user.id) {
            return res.status(403).send({ message: "User not authorized to delete ESP." });
        }

        await esp.destroy();

        res.status(200).send({ message: "ESP was deleted successfully!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
