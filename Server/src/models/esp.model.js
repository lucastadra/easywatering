const Sequelize = require('sequelize');
const db = require('../../config/database/sequelize.config');
const ESPData = require('./espData.model');
const Harvest = require('./harvest.model');

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

/* 
 *   One ESP has Many Data's, 
 *   but one Data belongs to only one ESP 
*/

Esp.hasMany(ESPData, {
    foreignKey: 'esp_id',
    as: 'espData'
});

ESPData.belongsTo(Esp, {
    foreignKey: 'esp_id',
    as: 'esp',
    onDelete: 'CASCADE'
});

/* 
 *   One Harvest has Many Esps's, 
 *   but one Esp belongs to only one Harvest 
*/

Harvest.hasMany(Esp, {
    foreignKey: 'harvest_id',
    as: 'esp'
});

Esp.belongsTo(Harvest, {
    foreignKey: 'harvest_id',
    as: 'harvests',
    onDelete: 'CASCADE'
});

module.exports = Esp;