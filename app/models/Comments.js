const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.UUID,
        },
        allowNull: true,
      });
    }
  }

  Comments.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Comments',
    }
  );
  return Comments;
};
