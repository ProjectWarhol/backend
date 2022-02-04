const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.UserWallet, {
        foreignKey: { name: 'walletId', type: DataTypes.UUID },
        as: 'userWallet',
      });
      this.belongsTo(models.Role, {
        foreignKey: { name: 'roleId', type: DataTypes.UUID },
        as: 'role',
      });
      this.hasMany(models.Playbook, {
        foreignKey: { name: 'ownerUserId', type: DataTypes.UUID },
        as: 'playbooks',
        onDelete: 'cascade',
      });
      this.hasMany(models.BattleCard, {
        foreignKey: { name: 'creatorUserId', type: DataTypes.UUID },
        as: 'battleCards',
        onDelete: 'cascade',
      });
      this.hasMany(models.Call, {
        foreignKey: { name: 'userId', type: DataTypes.UUID },
        as: 'calls',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      nickName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExp: DataTypes.DATE,
      invitationToken: DataTypes.STRING,
      invitationExp: DataTypes.DATE,
      confirmationToken: DataTypes.STRING,
      confirmationExp: DataTypes.DATE,
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
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
