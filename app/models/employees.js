const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employment extends Model {
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
          name: 'employeedId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }

    static createemploymentId = (userId, employeedId) => {
      return Employment.create({
        ...{ userId },
        ...{ employeedId },
      }).catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new StatusError('Employment already exists', 409);
        } else if (err.parent.constraint === 'Employement_employeeId_ck') {
          throw new StatusError('Self-employment', 409);
        } else {
          throw new StatusError(
            'Something went wrong while creating employment',
            500
          );
        }
      });
    };

    static deleteEmplyoment = (userId, employeedId) => {
      return Employment.destroy({
        where: {
          ...{ userId },
          ...{ employeedId },
        },
        individualHooks: true,
      })
        .catch(() => {
          throw new StatusError(
            'Something went wrong while deleting employment',
            500
          );
        })
        .then((destroyed) => {
          if (destroyed === 0) {
            throw new StatusError('Employment', 404);
          }
        });
    };
  }

  Employment.init(
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
        afterCreate: async (newEmployment) => {
          const { userId, employeedId } = newEmployment;

          await sequelize.models.User.increment('employed', {
            where: { id: userId },
          });
          await sequelize.models.User.increment('employees', {
            where: { id: employeedId },
          });
        },
        afterDestroy: async (oldEmployment) => {
          const { userId, employeedId } = oldEmployment;

          await sequelize.models.User.decrement('employed', {
            where: { id: userId },
          });
          await sequelize.models.User.decrement('employees', {
            where: { id: employeedId },
          });
        },
      },
      sequelize,
      timestamps: true,
      updatedAt: false,
      modelName: 'Employment',
    }
  );
  return Employment;
};
