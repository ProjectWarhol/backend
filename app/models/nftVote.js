const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { User } = require('./user');
const { NftContent } = require('./nftContent');

module.exports = (sequelize, DataTypes) => {
  class NftVote extends Model {}
  NftVote.init(
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
      contentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: NftContent,
          key: 'id',
        }
      },
      type: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'NftVote',
    }
  );
  return NftVote;
};
