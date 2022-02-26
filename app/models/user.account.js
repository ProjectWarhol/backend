const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAccount extends Model {}
  UserAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      publicKey: DataTypes.STRING,
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
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'UserAccount',
    }
  );
  return UserAccount;
};