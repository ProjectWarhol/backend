const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NftVote extends Model {
    static associate(models) {
      this.belongsTo(models.NftContent, {
        foreignKey: {
          name: 'contentId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }
  }

  NftVote.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      type: DataTypes.BOOLEAN,
    },
    {
      hooks: {
        afterCreate: async (newVote) => {
          const { contentId, type } = newVote;

          await sequelize.models.NftContent.increment(
            type ? 'upvotes' : 'downvotes',
            { where: { id: contentId } }
          );
        },
        afterDestroy: async (oldVote) => {
          const { contentId, type } = oldVote;

          await sequelize.models.NftContent.decrement(
            type ? 'upvotes' : 'downvotes',
            { where: { id: contentId } }
          );
        },
        afterUpdate: async (updatedVote) => {
          const { contentId, type } = updatedVote;

          await sequelize.models.NftContent.increment(
            type ? 'upvotes' : 'downvotes',
            { where: { id: contentId } }
          );
          await sequelize.models.NftContent.decrement(
            type ? 'downvotes' : 'upvotes',
            { where: { id: contentId } }
          );
        },
      },
      sequelize,
      timestamps: true,
      updatedAt: false,
      modelName: 'NftVote',
    }
  );
  return NftVote;
};
