const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserWallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: { name: 'walletId', type: DataTypes.UUID },
        as: 'user',
      });
      /**
      this.hasMany(models.Purchased, {
        foreignKey: { name: 'userId', type: DataTypes.UUID },
        as: 'purshased',
        onDelete: 'cascade',
      });
      this.hasMany(models.NftPromotes, {
        foreignKey: { name: 'userId', type: DataTypes.UUID },
        as: 'nftPromotes',
        onDelete: 'cascade',
      });
      this.hasMany(models.Comments, {
        foreignKey: { name: 'userId', type: DataTypes.UUID },
        as: 'comments',
        onDelete: 'cascade',
      });
      this.hasMany(models.Collection, {
        foreignKey: { name: 'ownerId', type: DataTypes.UUID },
        as: 'collection',
        onDelete: 'cascade',
      });
      this.hasMany(models.NftPictures, {
        foreignKey: { name: 'ownerId', type: DataTypes.UUID },
        as: 'nftPictures',
        onDelete: 'cascade',
      });
      */
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
      modelName: 'User',
    }
  );
  return UserWallet;
};
