const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'ownerUserId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });

      this.hasMany(models.User, {
        foreignKey: {
          name: 'companyId',
          type: DataTypes.UUID,
        },
        allowNull: true,
        constraints: false,
      });
    }

    static findById = (id) => {
      return Company.findByPk(id, { rejectOnEmpty: true }).catch(() => {
        throw new StatusError('Company', 404);
      });
    };
  }

  Company.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z0-9-_.]{4,20}$/i,
        },
      },
      website: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isUrl: true,
        },
      },

      primaryColor: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },

      secondaryColor: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },

      logo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
        defaultValue: 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png', // remove this later
      },

      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Company',
    }
  );
  return Company;
};
