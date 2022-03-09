const { Sequelize } = require('../models');
const db = require('../models');
const { commentObject } = require('../util/commentObject');

const {
  Sequelize: { Op },
  NftContent,
  Comments,
  User,
} = db;

const defaultCommentsError = (err) => {
  const error = new Error('Something went wrong');
  error.status = 500;
  if (err.name !== 'SequelizeDatabaseError') {
    error.err = err;
  }
  return error;
};

// Retrieve comments on picture
exports.retrieveComments = (req, res, next) => {
  const {
    body: { id, offset },
  } = req;

  Comments.findAll({
    ...{ offset },
    limit: 20,
    include: [
      {
        model: NftContent,
        attributes: [],
        required: true,
        where: { id },
      },
      {
        model: User,
        on: {
          id: { [Op.eq]: Sequelize.col('Comments.userId') },
        },
      },
    ],
  })
    .then((data) => {
      const commentObjects = data.map(comment => commentObject(comment));
      res.status(200).send({
        message: 'Comments sent successfully',
        data: commentObjects,
      });
    })
    .catch((err) => {
      next(defaultCommentsError(err));
    });
};

// Post a comment on a picture
exports.createComment = (req, res, next) => {
  const {
    body: { id, comment, userId },
  } = req;

  NftContent.findByPk(id)
    .then((picture) => {
      picture.createComment({
        ...{ comment },
        ...{ userId },
      })
        .then(() => {
          res.status(200).send({
            message: 'Comment created successfully',
          });
        });
    })
    .catch((err) => {
      next(defaultCommentsError(err));
    });
};
