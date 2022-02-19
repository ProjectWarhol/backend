const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { NftContent } = require('./nftContent');
const { Comment } = require('./comment');

module.exports = (sequelize, DataTypes) => {
  class PictureComment extends Model {}
  PictureComment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      pictureId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: NftContent,
          key: 'id',
        }
      },
      commentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Comment,
          key: 'id',
        }
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'PictureComment',
    }
  );
  return PictureComment;
};
