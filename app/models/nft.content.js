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
        allowNull: true,
      });

      this.hasMany(models.Comments, {
        foreignKey: {
          name: 'contentId',
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
        validate: {
          isUUID: 4,
        },
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      title: DataTypes.STRING,
<<<<<<< HEAD
      contentPath: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
        defaultValue: 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png', // remove this later
      },
      contentSize: {
        type: DataTypes.FLOAT,
        defaultValue: 10,
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 1,
      },
      flags: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      upvotes: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      downvotes: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      hasSold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
=======
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      contentPath: DataTypes.STRING,
      contentSize: DataTypes.FLOAT,
      price: DataTypes.FLOAT,
      flags: DataTypes.INTEGER,
      upvotes: DataTypes.INTEGER,
      downvotes: DataTypes.INTEGER,
      hasSold: DataTypes.BOOLEAN,
>>>>>>> main
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'NftContent',
    }
  );
  return NftContent;
};
