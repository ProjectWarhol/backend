const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NftContent extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsToMany(models.Comments, {
        through: models.PictureComments,
        foreignKey: 'pictureId',
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
      upvotes: DataTypes.INTEGER,
      downvotes: DataTypes.INTEGER,
      hasSold: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'NftContent',
    }
  );
  return NftContent;
};
