const db = require('../models');
const {
  defaultWrongInputHandler,
  defaultErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { NftVote } = db;

// Vote on NFT Content
exports.voteNFT = (req, res) => {
  const {
    body: { voteType, UserId },
    params: { id },
  } = req;

  NftVote.findOrCreate({
    where: {
      contentId: id,
      userId: UserId,
      type: voteType,
    },
  })

    .then(([voteObj, created]) => {
      if (created) {
        res.status(200).send({
          message: 'Vote was submitted successfully',
          value: voteObj,
        });
      } else {
        defaultWrongInputHandler(res, 'VoteType already exists');
      }
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while updating vote');
    });
};
