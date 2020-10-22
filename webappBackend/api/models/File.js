

module.exports = (sequelize, DataTypes) => {
    var File = sequelize.define('File', {
        id: {
            allowNull: false,
            primaryKey: true,
            unique: true,
            type: DataTypes.UUID
        },
        file_name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        s3_object_name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        metaData: {
            allowNull: false,
            type: DataTypes.JSON
        },
        created_date: {
            allowNull: false,
            unique: true,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
        {
            timestamps: false,
            freezeTableName: true,
            modelName: 'singularName'
        });

    return File;
}