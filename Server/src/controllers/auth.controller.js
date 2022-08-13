const Users = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();


exports.Signup = async (req, res) => {
  // Save User to Database
  try {
    const user = await Users.create({
      full_name: req.body.full_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      created_at: Date.now()
    });

    const result = user;
    if (result) res.send({ message: "User registered successfully!" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.Signin = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    req.session.token = token;
    return res.status(200).send({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      JWT: token
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.Signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};