'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
const question_category = sequelize.define('question_category', {
    ques_id : {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
    category_id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
}
,{
    timestamps: false,
    freezeTableName: true,
    modelName: 'singularName'
});
return question_category;
}