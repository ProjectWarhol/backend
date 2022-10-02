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

      this.belongsTo(models.Company, {
        foreignKey: {
          name: 'companyId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }
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
      sequelize,
      timestamps: true,
      updatedAt: false,
      modelName: 'Employment',
    }
  );
  return Employment;
};
