const { Sequelize } = require('../models');
const db = require('../models');
const { commentObject } = require('../util/commentObject');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

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
exports.createComment = (req, res) => {
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
      defaultCommentsError(err);
    });
};

// Delete a comment on a picture
exports.deleteComment = (req, res) => {
  const {
    body: { id },
  } = req;

  Comments.destroy({
    where: { id },
  })
    .then(() => {
      res.status(200).send({
        message: 'Comment deleted successfully',
      });
    })
    .catch((err) => {
      defaultErrorHandler(
        err,
        res,
        'Something went wrong while deleting comment'
      );
    });
};

// Patch Comment
exports.updateComment = async (req, res) => {
  const {
    params: { id },
  } = req;

  Comments.update(req.body, {
    where: { id },
    returning: true,
  })
    .then(([rowsUpdated]) => {
      if (rowsUpdated > 0) {
        res.status(200).send({
          message: 'Comment was updated successfully',
        });
      } else {
        noPathErrorHandler(res, 'Comment');
      }
    })
    .catch((err) => {
      defaultErrorHandler(
        err,
        res,
        'Something went wrong while updating comment'
      );
    });
};
