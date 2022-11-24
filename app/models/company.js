const { Model } = require('sequelize');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

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

      this.hasMany(models.NftContent, {
        foreignKey: {
          name: 'companyId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }

    static findById = (id) => {
      if (!id) throw new StatusError('Company', 404);
      return Company.findByPk(id, { rejectOnEmpty: true }).catch(() => {
        throw new StatusError('Company', 404);
      });
    };

    static createCompany = (
      companyName,
      website,
      primaryColor,
      secondaryColor,
      address,
      logo,
      bio
    ) => {
      return Company.findorCreate({
        where: {
          [Op.or]: [{ companyName }, { website }],
        },
        defaults: {
          ...{ primaryColor },
          ...{ secondaryColor },
          ...{ address },
          ...{ logo },
          ...{ bio },
        },
      }).catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          throw new StatusError('Company already exists', 409);
        } else {
          throw new StatusError(
            'Something went wrong while creating company',
            500
          );
        }
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
        allowNull: true,
        unique: false,
      },

      secondaryColor: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },

      logo: {
        type: DataTypes.STRING,
        allowNull: true,
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
