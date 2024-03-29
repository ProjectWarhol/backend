const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { sessionObject } = require('../util/sessionObject');
const { generateToken } = require('../util/tokenGenerator');

const { Op } = Sequelize;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Promoting, {
        as: 'promotions',
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.hasMany(models.Promoting, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.hasMany(models.NftContent, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.hasOne(models.Company, {
        foreignKey: {
          name: 'ownerUserId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });

      this.hasMany(models.JobPosition, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.hasMany(models.Comment, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.hasMany(models.NftVote, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.UserAccount, {
        foreignKey: {
          name: 'walletId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }

    static createNewUser(userName, email, password) {
      return bcrypt
        .hash(password, 12)
        .then((passwordHash) => {
          return User.findOrCreate({
            where: {
              [Op.or]: [{ userName }, { email }],
            },
            defaults: {
              ...{ userName },
              ...{ email },
              ...{ passwordHash },
            },
          });
        })
        .then(([user, created]) => {
          if (!created) {
            throw new StatusError('User already exists', 409);
          }
          return user;
        });
    }

    static findById = (id) => {
      if (!id) throw new StatusError('User', 404);
      return User.findByPk(id, { rejectOnEmpty: true }).catch(() => {
        throw new StatusError('User', 404);
      });
    };

    static findByLogin = (type, userCredential) => {
      if (!type || !userCredential) throw new StatusError('User', 404);
      return User.findOne({
        where: { [type]: userCredential },
        rejectOnEmpty: true,
      }).catch(() => {
        throw new StatusError('User', 404);
      });
    };

    static findByToken = (resetToken) => {
      if (!resetToken) throw new StatusError('User', 404);
      return User.findOne({
        where: { resetToken },
        rejectOnEmpty: true,
      }).catch(() => {
        throw new StatusError('User', 404);
      });
    };

    stripSensitive = () => sessionObject(this);

    login = (password, req) => {
      return this.comparePassword(password).then((doMatch) => {
        if (!doMatch) throw new StatusError('Wrong credentials', 403);
        const newSessionUser = this.stripSensitive();
        req.session.user = newSessionUser;
        return req.session.save();
      });
    };

    comparePassword = (password) => bcrypt.compare(password, this.passwordHash);

    setPassword = (password) => {
      return bcrypt.hash(password, 12).then((passwordHash) => {
        this.passwordHash = passwordHash;
        this.resetToken = null;
        this.resetTokenExp = null;
        return this.save();
      });
    };

    replacePassword = (oldPassword, newPassword) => {
      return this.comparePassword(oldPassword).then((doMatch) => {
        if (!doMatch) throw new StatusError('Wrong credentials', 403);
        this.setPassword(newPassword);
      });
    };

    setResetToken = () => {
      return generateToken()
        .then((token) => {
          this.resetToken = token.toString('hex');
          this.resetTokenExp = Date.now() + 3600000;
          return this.save();
        })
        .then(() => this.resetToken);
    };

    promotes = () => {
      return this.getPromotions({
        attributes: [],
        include: [User],
      })
        .then((promotions) =>
          promotions.map((promotion) => promotion.User.stripSensitive())
        )
        .catch(() => {
          throw new StatusError(
            'Something went wrong while fetching promotions',
            500
          );
        });
    };

    promotedBy = () => {
      return sequelize.models.Promoting.findAll({
        attributes: [],
        where: {
          promotedId: this.id,
        },
        include: [
          {
            model: User,
            on: {
              id: { [Sequelize.Op.eq]: Sequelize.col('Promoting.userId') },
            },
          },
        ],
      })
        .then((promoters) =>
          promoters.map((promoter) => promoter.User.stripSensitive())
        )
        .catch(() => {
          throw new StatusError(
            'Something went wrong while fetching promoters',
            500
          );
        });
    };
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z0-9-_.]{4,20}$/i,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^\$2[ayb]\$.{56}$/,
        },
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
        defaultValue: 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png', // remove this later
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExp: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      promoters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      promoting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
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
      modelName: 'User',
    }
  );
  return User;
};
