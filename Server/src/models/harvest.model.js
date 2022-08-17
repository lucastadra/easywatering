const Sequelize = require('sequelize');
const db = require('../../config/database/sequelize.config');

class Harvest extends Sequelize.Model {};

Harvest.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name'
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    desc: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'desc',
        validate: {
            max: 40
        }
    },
    created_at: {
        type: Sequelize.DATE,
        field: 'created_at'
    }
}, { sequelize: db, modelName: 'harvest' });

module.exports = Harvest;