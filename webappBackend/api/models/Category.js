'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
const Category = sequelize.define('Category', {
    id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
}
,{
    timestamps: false,
    freezeTableName: true,
    modelName: 'singularName'
});

// Category.associate = function(models) {
//     models.Category.belongsToMany(models.Question,{
//         foreignKey:{
//         name: 'categoryId',
//         allowNull: false
//         },
//         through: 'UserCategory',
//         as:'questions',
//         sourceKey:'id'
//     });
//   };

return Category;
}