const db = require('../models');
const { commentObject } = require('../util/commentObject');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { NftContent, User } = db;

// Retrieve comments on picture
exports.retrieveComments = (req, res, next) => {
  const {
    body: { offset },
    params: { id },
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
      const commentObjects = data.map((comment) => commentObject(comment));
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
    body: { comment, userId },
    params: { id },
  } = req;

  NftContent.findByPk(id)
    .then((picture) => {
      picture
        .createComment({
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
