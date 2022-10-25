const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAccount extends Model {
    static associate(models) {
      this.hasOne(models.User, {
        foreignKey: {
          name: 'walletId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }
  }

  UserAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      publicKey: {
        type: DataTypes.STRING,
        allowNull: true, // false
        validate: {
          is: /^0x[a-fA-F0-9]{40}$/,
        },
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      mnemonicHash: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      ciphertext: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      iv: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      cipher: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      kdf: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      mac: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      dklen: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true, // false
      },
      n: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      r: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
      p: {
        type: DataTypes.INTEGER,
        allowNull: true, // false
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'UserAccount',
    }
  );
  return UserAccount;
};
