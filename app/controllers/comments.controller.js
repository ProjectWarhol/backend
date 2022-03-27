const {
  findNftById,
  getNftComments,
  createNftComment,
} = require('../service/nft.content');

// Retrieve comments on picture
exports.retrieveComments = async (req, res) => {
  const {
    body: { offset },
    params: { id },
  } = req;

  const nft = await findNftById(id, res);
  if (!nft || res.headersSent) return;

  const comments = await getNftComments(nft, offset, res);
  if (!comments || res.headersSent) return;

  res.status(200).send({
    message: 'Comments sent successfully',
    data: comments,
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
