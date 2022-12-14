const Users = require("../models/user.model");

checkDuplicateEmail = async (req, res, next) => {
  try {
    // Email
    let user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: "Unable to validate Email!"
    });
  }
};

const verifySignUp = {
    checkDuplicateEmail
};

module.exports = verifySignUp;