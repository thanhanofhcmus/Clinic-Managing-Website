const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('disease', {
        id: {
            autoIncrement: true,
            autoIncrementIdentity: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        desciption: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'disease',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "disease_pkey",
            unique: true,
            fields: [
                { name: "id" },
            ]
        }, ]
    });
};