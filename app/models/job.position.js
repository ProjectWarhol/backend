const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobPosition extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.Company, {
        foreignKey: {
          name: 'companyId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }

    static findById = (id) => {
      if (!id) throw new StatusError('JobPosition', 404);
      return JobPosition.findByPk(id, { rejectOnEmpty: true }).catch(() => {
        throw new StatusError('JobPosition', 404);
      });
    };
  }

  JobPosition.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'JobPosition',
    }
  );
  return JobPosition;
};
