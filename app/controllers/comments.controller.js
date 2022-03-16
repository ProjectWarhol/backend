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

// Delete a comment on a picture
exports.deleteComment = (req, res, next) => {
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
      next(defaultCommentsError(err));
    });
};

// Patch Comment
exports.updateComment = async (req, res, next) => {
  const {
    params: { id },
  } = req;

  Comments.update(req.body, {
    where: { id },
    returning: true,
  })
    .then(([rowsUpdated, [updatedComment]]) => {
      if (rowsUpdated) {
        res.status(200).send({
          message: 'Comment was updated successfully',
          comment: updatedComment,
        });
      } else {
        const error = new Error('Comment not found');
        error.status = 404;
        next(error);
      }
    })
    .catch((err) => {
      const error = new Error(
        'Something went wrong while updating the comment'
      );
      error.err = err;
      next(error);
    });
};
