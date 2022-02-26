const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NftContent extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'ownerId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });
    }
  }

  NftContent.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      title: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      contentPath: DataTypes.STRING,
      contentSize: DataTypes.FLOAT,
      price: DataTypes.FLOAT,
      flags: DataTypes.INTEGER,
      upVotes: DataTypes.INTEGER,
      downVotes: DataTypes.INTEGER,
      hasSold: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: true,
      updatedAt: false,
      modelName: 'NftContent',
    }
  );
  return NftContent;
};
