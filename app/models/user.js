const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Promoting, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.UserAccount, {
        foreignKey: {
          name: 'walletId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true, // change to false
        unique: true,
        validate: {
          isEmail: true,
          notNull: false, // change to true later
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: true, // change to false
        validate: {
          notNull: false, // change to true later
          notEmpty: false, // change to true later
        },
        defaultValue: 'abcd1234',
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      resetToken: DataTypes.STRING,
      resetTokenExp: DataTypes.DATE,
      bio: DataTypes.STRING,
      promoters: DataTypes.INTEGER,
      promoting: DataTypes.INTEGER,
      verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'User',
    }
  );
  return User;
};
