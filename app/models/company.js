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

      this.hasMany(models.JobPosition, {
        foreignKey: {
          name: 'companyId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.User, {
        foreignKey: {
          name: 'id',
          type: DataTypes.UUID,
        },
        as: 'owner',
        allowNull: false,
      });
    }

    static findById = (id) => {
      if (!id) throw new StatusError('Company', 404);
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
          len: [4, 255],
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
