var express = require('express');
var cors = require('cors');
var routes = require('./routes/index.routes');
require('dotenv').config()

var db = require('../config/database/sequelize');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`); // For development purposes only
});