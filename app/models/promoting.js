const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Promoting extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.User, {
        foreignKey: {
          name: 'promotedId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }

    static createPromotion = (userId, promotedId) => {
      return Promoting.create({
        ...{ userId },
        ...{ promotedId },
      }).catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new StatusError('Promotion already exists', 409);
        } else if (err.parent.constraint === 'Promoting_promotedId_ck') {
          throw new StatusError('Self-promotion', 409);
        } else {
          throw new StatusError(
            'Something went wrong while creating promotion',
            500
          );
        }
      });
    };

    static deletePromotion = (userId, promotedId) => {
      return Promoting.destroy({
        where: {
          ...{ userId },
          ...{ promotedId },
        },
        individualHooks: true,
      })
        .catch(() => {
          throw new StatusError(
            'Something went wrong while deleting promotion',
            500
          );
        })
        .then((destroyed) => {
          if (destroyed === 0) {
            throw new StatusError('Promotion', 404);
          }
        });
    };
  }

  Promoting.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
    },
    {
      hooks: {
        afterCreate: async (newPromoting) => {
          const { userId, promotedId } = newPromoting;

          await sequelize.models.User.increment('promoting', {
            where: { id: userId },
          });
          await sequelize.models.User.increment('promoters', {
            where: { id: promotedId },
          });
        },
        afterDestroy: async (oldPromoting) => {
          const { userId, promotedId } = oldPromoting;

          await sequelize.models.User.decrement('promoting', {
            where: { id: userId },
          });
          await sequelize.models.User.decrement('promoters', {
            where: { id: promotedId },
          });
        },
      },
      sequelize,
      timestamps: true,
      updatedAt: false,
      tableName: 'Promoting',
    }
  );
  return Promoting;
};
