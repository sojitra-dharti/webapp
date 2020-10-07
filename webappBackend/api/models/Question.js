'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
const Question = sequelize.define('Question', {
    id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: false
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

return Question;
}