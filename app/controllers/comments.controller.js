const db = require('../models');

const { NftContent, Comments } = db;

// Retrieve comments on picture
exports.retrieveComments = (req, res, next) => {
  const {
    body: { offset },
    params: { id },
  } = req;

  NftContent.findById(id)
    .then((nft) => nft.getNftComments(Number(offset), 20))
    .then((comments) => {
      return res.status(200).send({
        message: 'Comments sent successfully',
        data: comments,
      });
    })
    .catch((err) => next(err));
};

// Post a comment on a picture
exports.createComment = (req, res, next) => {
  const {
    body: { comment },
    params: { nftId },
    user: { id: userId },
  } = req;

  NftContent.findById(nftId)
    .then((nft) => nft.createNftComment(userId, comment))
    .then(() => {
      return res.status(200).send({
        message: 'Comment created successfully',
      });
    })
    .catch((err) => next(err));
};

// Delete a comment on a picture
exports.deleteComment = (req, res, next) => {
  const {
    params: { commentId },
    user: { id: userId },
  } = req;

  Comments.findById(commentId)
    .then((comment) => {
      if (comment.userId !== userId) {
        return next(new StatusError('unauthorized', 401));
      }
      return comment.destroy();
    })
    .then(() => {
      return res.status(200).send({
        message: 'Comment deleted successfully',
      });
    })
    .catch((err) => next(err));
};

// Patch Comment
exports.updateComment = (req, res, next) => {
  const {
    params: { commentId },
    body: { comment },
    user: { id: userId },
  } = req;

  Comments.findById(commentId)
    .then((commentInstance) => {
      if (commentInstance.userId !== userId) {
        return next(new StatusError('unauthorized', 401));
      }
      return commentInstance.updateComment(comment);
    })
    .then(() => {
      return res.status(200).send({
        message: 'Comment updated successfully',
      });
    })
    .catch((err) => next(err));
};
