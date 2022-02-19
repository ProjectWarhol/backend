const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { User } = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Promoting extends Model {}
  Promoting.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        }
      },
      promoterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        }
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
