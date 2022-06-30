const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NftChild extends Model {
    static associate(models) {
      this.belongsTo(models.NftContent, {
        foreignKey: {
          name: 'id',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }
  }

  NftChild.init(
    {
      childId: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
      },
      parentId: {
        type: DataTypes.UUID,
        primaryKey: false,
        validate: {
          isUUID: 4,
        },
      },
      favoriteChild: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'NftChild',
    }
  );
  return NftChild;
};
