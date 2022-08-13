const Sequelize = require('sequelize');
const db = require('../../config/database/sequelize.config');

class Users extends Sequelize.Model {};

Users.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    full_name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: {
        type: Sequelize.STRING,
        validate: {
          min: 6
        },
        field: 'password'
        // Other attributes here
    },
    created_at: Sequelize.DATE
}, { sequelize: db, modelName: 'users' });

module.exports = Users;