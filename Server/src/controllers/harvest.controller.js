// harvestRouter.get('/:harvestId', authJwt.verifyToken, harvestController.GetById);
// harvestRouter.get('/:espId', authJwt.verifyToken, harvestController.GetByESP);
// harvestRouter.post('/:harvestId', authJwt.verifyToken, harvestController.Create);
// harvestRouter.put('/:harvestId', authJwt.verifyToken, harvestController.Update);
// harvestRouter.delete('/:harvestId', authJwt.verifyToken, harvestController.Delete);

const ESP = require('../models/esp.model');
const ESPData = require('../models/espData.model');
const Users = require("../models/user.model");
const Harvests = require("../models/harvest.model");

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

        const harvests = await Harvests.findAll({
            where: {
                user_id: req.userId
            }
        });

        res.send({ harvests });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.GetById = async (req, res) => {
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

        const user = await Users.findOne({ where: { id: req.userId } })

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const harvest = await Harvests.findByPk(req.params.harvestId);

        if (!harvest) {
            return res.status(404).send({ message: "Harvest not found." });
        }

        if (harvest.user_id !== user.id) {
            return res.status(403).send({ message: "User not authorized to view Harvest." });
        }

        res.send({ harvest });

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

        const harvest = await Harvests.create({
            name: req.body.name,
            status: true,
            user_id: user.id,
            desc: req.body.desc,
            created_at: Date.now()
        });

        if (harvest) {
            res.status(200).send({ harvest, message: "Harvest registered successfully!" });
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.Update = async (req, res) => {
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

        const user = await Users.findOne({ where: { id: req.userId } })

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const harvest = await Harvests.findByPk(req.params.harvestId);

        if (!harvest) {
            return res.status(404).send({ message: "Harvest not found." });
        }

        if (harvest.user_id !== user.id) {
            return res.status(403).send({ message: "User not authorized to edit Harvest." });
        }

        harvest.name = req.body.name === null ? harvest.name : req.body.name;
        harvest.status = req.body.status === null ? true : req.body.status;
        harvest.desc = req.body.desc === null ? harvest.desc : req.body.desc;

        await harvest.save();

        res.status(200).send({ harvest, message: "Harvest was been updated successfully!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.Delete = async (req, res) => {
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

        const user = await Users.findOne({ where: { id: req.userId } })

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const harvest = await Harvests.findByPk(req.params.harvestId);

        if (!harvest) {
            return res.status(404).send({ message: "Harvest not found." });
        }

        if (harvest.user_id !== user.id) {
            return res.status(403).send({ message: "User not authorized to delete Harvest." });
        }

        await harvest.destroy();

        res.status(200).send({ message: "Harvest was deleted successfully!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};