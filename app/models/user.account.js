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
<<<<<<< HEAD
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
      versionId: {
        type: DataTypes.UUID,
        allowNull: true, // false
      },
      address: {
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
=======
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      publicKey: DataTypes.STRING,
      mnumonicHash: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      version: DataTypes.INTEGER,
      versionId: DataTypes.UUID,
      address: DataTypes.STRING,
      ciphertext: DataTypes.STRING,
      iv: DataTypes.STRING,
      cipher: DataTypes.STRING,
      kdf: DataTypes.STRING,
      mac: DataTypes.STRING,
      dklen: DataTypes.INTEGER,
      salt: DataTypes.STRING,
      n: DataTypes.INTEGER,
      r: DataTypes.INTEGER,
      p: DataTypes.INTEGER,
>>>>>>> main
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'UserAccount',
    }
  );
  return UserAccount;
};
