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
      userId,
      companyName,
      website,
      primaryColor,
      secondaryColor,
      address,
      logo,
      bio
    ) => {
      return Company.findOrCreate({
        where: {
          [Op.or]: [{ companyName }, { website }],
        },
        defaults: {
          companyName,
          website,
          ownerUserId: userId,
          primaryColor: primaryColor || '#000000',
          secondaryColor: secondaryColor || '#000000',
          address: address || '',
          logo: logo || 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png',
          bio: bio || '',
          createdAt: Date.now(),
        },
      })
        .then(([company, created]) => {
          if (!created) {
            throw new StatusError('Company already exists', 409);
          }
          return company;
        })
        .catch((err) => {
          throw err;
        });
    };

    static patchCompany = (
      id,
      userId,
      companyName,
      website,
      primaryColor,
      secondaryColor,
      address,
      logo,
      bio
    ) => {
      return Company.findById(id)
        .then((company) => {
          if (company.ownerUserId !== userId) {
            throw new StatusError('unauthorized', 401);
          }

          return company.update({
            companyName,
            website,
            primaryColor,
            secondaryColor,
            address,
            logo,
            bio,
          });
        })
        .catch(() => {
          throw new StatusError(
            'Something went wrong while updating Company',
            500
          );
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
