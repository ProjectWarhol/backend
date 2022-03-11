const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PictureComments extends Model {}

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
