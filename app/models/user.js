const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.UserWallet, {
        foreignKey: { name: 'walletId', type: DataTypes.UUID },
        as: 'userWallet',
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
        defaultValue: 'omar.badawy@hotmail.com',
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
      promoter: DataTypes.INTEGER,
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
