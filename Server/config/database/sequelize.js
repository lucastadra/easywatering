const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    database: '',
    dialect: 'postgres'
});

module.exports = sequelize