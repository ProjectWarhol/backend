const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserWallet extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: { name: 'walletId', type: DataTypes.UUID },
        as: 'user',
      });
    }
  }
  UserWallet.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      publicKey: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notNull: false, // change to true later
          notEmpty: false, // note change to true later
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        validate: {
          notNull: false, // change to true later
          notEmpty: false, // note change to true later
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'UserWallet',
    }
  );
  return UserWallet;
};
