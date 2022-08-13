var express = require('express');
const cookieSession = require("cookie-session");
var cors = require('cors');
var routes = require('./routes/index.routes');
var db = require('../config/database/sequelize.config');

const app = express();
require('dotenv').config();

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
};

db.sync().then(() => console.log("DB Sync complete."))

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
      name: process.env.COOKIE_NAME.toString(),
      secret: process.env.COOKIE_SECRET.toString(),
      httpOnly: true
    })
);

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`); // For development purposes only
});