'use strict';
module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
    id: {
        allowNull: false,
        primaryKey: true,
        unique:true,
        type: DataTypes.UUID,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    password: {
        allowNull: false,
        type: DataTypes.STRING 
    },
    email: {
        allowNull: false,
        unique:true,
        type: DataTypes.STRING
    }
});
return User;
}