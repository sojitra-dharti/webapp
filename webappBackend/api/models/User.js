'use strict';
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
    }
});
return User;
}