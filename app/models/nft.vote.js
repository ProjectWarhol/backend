const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NftVote extends Model {
    static associate(models) {
      this.belongsTo(models.NftContent, {
        foreignKey: {
          name: 'contentId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });

      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }
  }

  NftVote.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: DataTypes.DATE,
      type: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'NftVote',
    }
  );
  return NftVote;
};
