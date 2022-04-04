const db = require('../models');
const {
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');
const { commentObject } = require('../util/commentObject');

const { User } = db;

exports.getComments = async (nft, offset, res) => {
  const comments = await nft
    .getComments({
      ...{ offset },
      limit: 20,
      joinTableAttributes: [],
      include: [User],
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while fetching comments');
    });

  try {
    comments.map((comment) => commentObject(comment));
  } catch (err) {
    defaultErrorHandler(res, 'Something went wrong while fetching comments');
  }

  return comments;
};

exports.createNewComment = async (nft, comment, userId, res) => {
  const newComment = await nft
    .createComment({
      ...{ comment },
      ...{ userId },
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while creating comment');
    });

  return newComment !== undefined;
};
