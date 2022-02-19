const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { User } = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {}
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id',
          }
        },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Comment',
    }
  );
  return Comment;
};
