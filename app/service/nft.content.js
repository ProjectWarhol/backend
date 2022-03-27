const db = require('../models');
const {
  noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');
const { commentObject } = require('../util/commentObject');

const { NftContent, User } = db;

exports.findNftById = async (id, res) => {
  const nft = await NftContent.findByPk(id, { rejectOnEmpty: true }).catch(
    () => {
      noPathErrorHandler(res, 'Nft');
    }
  );

  return nft;
};

exports.getNftComments = async (nft, offset, res) => {
  const comments = await nft
    .getComments({
      ...{ offset },
      limit: 20,
      joinTableAttributes: [],
      include: [User],
    })
    .then((data) => data.map((comment) => commentObject(comment)))
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while fetching comments');
    });

  return comments;
};

exports.createNftComment = async (nft, comment, userId, res) => {
  const newComment = await nft
    .createComment({
      ...{ comment },
      ...{ userId },
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while creating comment');
    });

<<<<<<< HEAD
  return created;
=======
  return newComment !== undefined;
>>>>>>> 3ff8eb2 (fixup defined service)
};
