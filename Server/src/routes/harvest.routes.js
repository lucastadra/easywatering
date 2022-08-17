var express = require('express');
const harvestRouter = express.Router();
const harvestController = require('../controllers/harvest.controller');
const { authJwt } = require('../middlewares/index.middleware');

harvestRouter.get('/', authJwt.verifyToken, harvestController.GetAll);
harvestRouter.get('/:harvestId', authJwt.verifyToken, harvestController.GetById);
harvestRouter.post('/', authJwt.verifyToken, harvestController.Create);
harvestRouter.put('/:harvestId', authJwt.verifyToken, harvestController.Update);
harvestRouter.delete('/:harvestId', authJwt.verifyToken, harvestController.Delete);
// harvestRouter.get('/harvest/:espId/type/:typeId', authJwt.verifyToken, harvestController.GetByType);

module.exports = harvestRouter;