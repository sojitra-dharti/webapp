'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
    id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING 
    },
    email_address: {
        allowNull: false,
        unique:true,
        type: DataTypes.STRING
    }, 
    account_created: {
        allowNull: false,
        unique:true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    account_updated: {
        allowNull: false,
        unique:true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}
,{
    timestamps: false,
    freezeTableName: true,
    modelName: 'singularName'
});
return User;
}