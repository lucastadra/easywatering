const Sequelize = require('sequelize');
const db = require('../../config/database/sequelize.config');
const Esp = require("./esp.model");
const Harvest = require("./harvest.model");


class User extends Sequelize.Model {};

User.init({
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
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Date.now()
    }
}, { sequelize: db, modelName: 'users' });

/* 
 *   One user has Many ESP's, 
 *   but one Esp belongs to only one user 
*/
User.hasMany(Esp, {
    foreignKey: 'user_id',
    as: 'esp'
});

Esp.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
});

/* 
 *   One user has Many Harvest's, 
 *   but one Harvest belongs to only one user 
*/
User.hasMany(Harvest, {
    foreignKey: 'user_id',
    as: 'harvest'
});

Harvest.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE'
});


module.exports = User;