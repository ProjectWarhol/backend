const db = require('../models');
const {
  // noPathErrorHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { NftContent, NftVote } = db;

// Vote on NFT Content
exports.voteNFT = (req, res) => {
  const {
    body: { vote, userId },
    params: { id },
  } = req;
  NftContent.findByPk(id)
    .then(() => {
      if (vote === true) {
        console.log('ok');
        NftContent.increment('upVotes', { by: 1, where: { id } });
      } else {
        NftContent.increment('downVotes', { by: 1, where: { id } });
      }
    })
    .then(() => {
      NftVote.create({
        contentid: id,
        userid: userId,
        type: vote,
      });
    })
    .then(() => {
      res.status(200).send({
        message: 'Vote submitted successfully',
      });
    })
    .catch((err) => {
      defaultErrorHandler(
        err,
        'Something went wrong voting on the NFT content.'
      );
    });
};
