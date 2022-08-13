var express = require('express');
const authRouter = express.Router();
const { verifySignUp } = require('../middlewares/index.middleware');
const authController = require('../controllers/auth.controller');

authRouter.post('/signup', verifySignUp.checkDuplicateEmail, authController.Signup);
authRouter.post('/signin', authController.Signin);
authRouter.post('/signout', authController.Signout);

module.exports = authRouter;