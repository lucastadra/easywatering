var express = require('express');
const espRouter = express.Router();
const espController = require('../controllers/esp.controller');
const { authJwt } = require('../middlewares/index.middleware');

espRouter.get('/', authJwt.verifyToken, espController.GetById);
espRouter.post('/', authJwt.verifyToken, espController.Create);
espRouter.get('/:espId', authJwt.verifyToken, espController.GetById);
espRouter.get('/harvest/:harvestId', authJwt.verifyToken, espController.GetByHarvest);

module.exports = espRouter;