const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PictureComments extends Model {
    static associate(models) {
      this.belongsTo(models.Comments, {
        foreignKey: {
          name: 'commentId',
          type: DataTypes.UUID,
        },
        allowNull: false,
      });

      this.belongsTo(models.NftContent, {
        foreignKey: {
          name: 'pictureId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }
  }

  PictureComments.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'PictureComments',
    }
  );
  return PictureComments;
};
