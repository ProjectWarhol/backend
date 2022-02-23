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
          name: 'promoterId',
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
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,   
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Promoting',
    }
  );
  return Promoting;
};