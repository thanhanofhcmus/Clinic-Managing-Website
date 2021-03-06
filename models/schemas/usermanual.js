module.exports = function (sequelize, DataTypes) {
  return sequelize.define('usermanual', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'usermanual',
    schema: 'public',
    timestamps: false,
    indexes: [{
      name: 'usermanual_pkey',
      unique: true,
      fields: [
        { name: 'id' }
      ]
    }]
  });
};
