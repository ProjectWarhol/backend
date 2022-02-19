const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { User } = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {}
  Collection.init(
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
      collectionName: DataTypes.STRING,
      numberOfNft: DataTypes.INTEGER,
      dropDate: DataTypes.DATE,
      collectionAvatar: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Collection',
    }
  );
  return Collection;
};
