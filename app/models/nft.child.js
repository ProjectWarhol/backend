const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NftChild extends Model {
    static associate(models) {
      this.belongsTo(models.NftContent, {
        foreignKey: {
          name: 'parentId',
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