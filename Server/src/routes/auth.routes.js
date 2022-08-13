var express = require('express');
const authRouter = express.Router();
const verifySignUp = require("../middleware");
const authController = require("../controllers/auth.controller");

authRouter.post("/signup", verifySignUp, authController.Signup);
authRouter.post("/signin", authController.Signin);
authRouter.post("/signout", authController.Signout);

module.exports = authRouter;