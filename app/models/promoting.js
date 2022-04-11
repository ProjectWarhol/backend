const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Promoting extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.User, {
        foreignKey: {
          name: 'promotedId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }
  }

  Promoting.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
    },
    {
      sequelize,
      timestamps: true,
      updatedAt: false,
      modelName: 'Promoting',
    }
  );
  return Promoting;
};
