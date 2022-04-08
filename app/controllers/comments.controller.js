const { findNftById } = require('../service/nft.content');
const { getComments, createNewComment } = require('../service/comments');

const db = require('../models');

const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { Comments } = db;

// Retrieve comments on picture
exports.retrieveComments = async (req, res) => {
  const {
    body: { offset },
    params: { id },
  } = req;

  const nft = await findNftById(id, res);
  if (!nft || res.headersSent) return;

  const comments = await getComments(nft, offset, res);
  if (!comments || res.headersSent) return;

  res.status(200).send({
    message: 'Comments sent successfully',
    data: comments,
  });
};

// Post a comment on a picture
exports.createComment = async (req, res) => {
  const {
    body: { comment, userId },
    params: { id },
  } = req;

  const nft = await findNftById(id, res);
  if (!nft || res.headersSent) return;

  const created = await createNewComment(nft, comment, userId, res);
  if (!created || res.headersSent) return;

  res.status(200).send({
    message: 'Comment created successfully',
  });
};

// Delete a comment on a picture
exports.deleteComment = (req, res) => {
  const {
    params: { id },
  } = req;

  Comments.destroy({
    where: { id },
  })
    .then(() => {
      res.status(200).send({
        message: 'Comment deleted successfully',
      });
    })
    .catch(() => {
      defaultErrorHandler(
        res,
        'Something went wrong while deleting the comment'
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
    .catch(() => {
      defaultErrorHandler(
        res,
        'Something went wrong while updating the comment'
      );
    });
};
