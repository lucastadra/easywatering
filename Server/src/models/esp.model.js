const Sequelize = require('sequelize');
const db = require('../../config/database/sequelize.config');
const EspData = require('./espData.model');

class Esp extends Sequelize.Model {};

Esp.init({
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    alias: Sequelize.STRING,
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: Sequelize.DATE,
        field: 'created_at'
    }
}, { sequelize: db, modelName: 'esps' });

Esp.hasMany(EspData, {
    foreignKey: 'esp_id',
    as: 'espData'
});

EspData.belongsTo(Esp, {
    foreignKey: 'esp_id',
    as: 'esp',
    onDelete: 'CASCADE'
});

module.exports = Esp;