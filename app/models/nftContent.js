const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { User } = require('./user');
const { Collection } = require('./collection');

module.exports = (sequelize, DataTypes) => {
  class NftContent extends Model {}
  NftContent.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        }
      },
      title: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      contentPath: DataTypes.STRING,
      contentSize: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      flags: DataTypes.INTEGER,
      upvoted: DataTypes.INTEGER,
      downvotes: DataTypes.INTEGER,
      hasSold: DataTypes.BOOLEAN,
      collectionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: Collection,
          key: 'id',
        }
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'NftContent',
    }
  );
  return NftContent;
};
