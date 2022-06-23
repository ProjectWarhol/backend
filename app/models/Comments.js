const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.NftContent, {
        foreignKey: {
          name: 'contentId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }

    static findById = (id) => {
      return Comments.findByPk(id, { rejectOnEmpty: true }).catch(() => {
        throw new StatusError('Comment', 404);
      });
    };

    updateComment = (comment) => {
      this.comment = comment;
      return this.save();
    };
  }

  Comments.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Comments',
    }
  );
  return Comments;
};
