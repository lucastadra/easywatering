var express = require('express');
const dataRouter = express.Router();
const dataController = require('../controllers/data.controller');
const { authJwt } = require('../middlewares/index.middleware');

dataRouter.get('/:dataId', authJwt.verifyToken, dataController.GetById);
dataRouter.get('/esp/:espId', authJwt.verifyToken, dataController.GetByESP);
dataRouter.get('/esp/:espId/type/:typeId', authJwt.verifyToken, dataController.GetByType);

module.exports = dataRouter;