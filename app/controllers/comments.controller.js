const { sequelize } = require('../models');
const db = require('../models');

const { NftContent, Comments } = db;

// Retrieve comments on picture
exports.retrieveComments = (req, res, next) => {
  const {
    body: { offset },
    params: { id },
  } = req;

  try {
    sequelize.transaction(async (t) => {
      const nftContent = await NftContent.findById(id, { transaction: t });
      const comments = await nftContent.getNftComments(offset, 20, {
        transaction: t,
      });

      const count = await Comments.count({
        where: {
          contentId: id,
        },
        transaction: t,
      });

      return res.status(200).send({
        message: 'Comments sent successfully',
        data: {
          comments,
          count,
        },
      });
    });
  } catch (err) {
    next(err);
  }
};

// Post a comment on a picture
exports.createComment = (req, res, next) => {
  const {
    body: { comment, userId },
    params: { id },
  } = req;

  NftContent.findById(id)
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
    params: { id },
    body: { userId },
  } = req;

  Comments.findById(id)
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
    params: { id },
    body: { comment },
    body: { userId },
  } = req;

  Comments.findById(id)
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
