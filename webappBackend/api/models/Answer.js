'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
const Answer = sequelize.define('Answer', {
    id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
    answer_text: {
        allowNull: false,
        type: DataTypes.STRING
    }, 
    created_timestamp: {
        allowNull: false,
        unique:true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_timestamp: {
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
return Answer;
}

