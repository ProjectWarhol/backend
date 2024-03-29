const { Model } = require('sequelize');
const Sequelize = require('sequelize');

const { commentObject } = require('../util/commentObject');

module.exports = (sequelize, DataTypes) => {
  class NftContent extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });

      this.hasMany(models.Comment, {
        foreignKey: {
          name: 'contentId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.hasMany(models.NftVote, {
        foreignKey: {
          name: 'contentId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.Company, {
        foreignKey: {
          name: 'companyId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }

    static findById = (id) => {
      if (!id) throw new StatusError('Nft', 404);
      return NftContent.findByPk(id, { rejectOnEmpty: true }).catch(() => {
        throw new StatusError('Nft', 404);
      });
    };

    getNftComments = (offset, limit) => {
      return this.getComments({
        ...{ offset },
        ...{ limit },
        include: [sequelize.models.User],
      })
        .then((comments) => comments.map((comment) => commentObject(comment)))
        .catch(() => {
          throw new StatusError(
            'Something went wrong while fetching comments',
            500
          );
        });
    };

    createNftComment = (userId, comment) => {
      return this.createComment({
        ...{ userId },
        ...{ comment },
        include: [sequelize.models.User],
      }).catch(() => {
        throw new StatusError(
          'Something went wrong while creating comment',
          500
        );
      });
    };

    getVotes = () => {
      return this.countNftVotes({ where: { type: true } })
        .then((upvotes) =>
          this.countNftVotes({ where: { type: false } }).then((downvotes) => [
            { upvotes },
            { downvotes },
          ])
        )
        .catch(() => {
          throw new StatusError(
            'Something went wrong while fetching votes',
            500
          );
        });
    };

    createVote = (userId, type) => {
      return this.createNftVote({
        ...{ userId },
        ...{ type },
      }).catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new StatusError('Vote already exists', 409);
        }
        throw new StatusError('Something went wrong while creating vote', 500);
      });
    };
  }

  NftContent.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      title: DataTypes.STRING,
      contentPath: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
        defaultValue: 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png', // remove this later
      },
      contentSize: {
        type: DataTypes.FLOAT,
        defaultValue: 10,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 1,
      },
      flags: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      upvotes: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      downvotes: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      hasSold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
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
