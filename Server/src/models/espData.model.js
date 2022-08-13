const Sequelize = require('sequelize');
const db = require('../../config/database/sequelize.config');

class EspData extends Sequelize.Model {};

EspData.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'value'
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'type'
    },
    obs: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'obs'
    },
    alias: Sequelize.STRING,
    created_at: {
        type: Sequelize.DATE,
        field: 'created_at'
    }
}, { sequelize: db, modelName: 'espsData' });

module.exports = EspData;