const db = require('../models');

const { NftContent, NftVote } = db;

exports.retrieveNftVotes = (req, res, next) => {
  const {
    params: { nftId },
  } = req;

  NftContent.findById(nftId)
    .then((nft) => nft.getVotes())
    .then((votes) => {
      return res.status(200).send({
        message: 'Votes sent successfully',
        data: {
          ...votes[0],
          ...votes[1],
        },
      });
    })
    .catch((err) => next(err));
};

exports.createNftVote = (req, res, next) => {
  const {
    params: { nftId },
    body: { type },
    user: { id: userId },
  } = req;

  NftContent.findById(nftId)
    .then((nft) => nft.createVote(userId, type))
    .then(() => {
      return res.status(200).send({
        message: 'Vote created successfully',
      });
    })
    .catch((err) => next(err));
};

exports.deleteNftVote = (req, res, next) => {
  const {
    params: { nftId },
    user: { id: userId },
  } = req;

  NftVote.findByContentAndUserId(nftId, userId)
    .then((vote) => vote.destroy())
    .then(() => {
      return res.status(200).send({
        message: 'Vote deleted successfully',
      });
    })
    .catch((err) => next(err));
};

exports.updateNftVote = (req, res, next) => {
  const {
    params: { nftId },
    user: { id: userId },
  } = req;

  NftVote.findByContentAndUserId(nftId, userId)
    .then((vote) => vote.switchType())
    .then(() => {
      return res.status(200).send({
        message: 'Vote updated successfully',
      });
    })
    .catch((err) => next(err));
};
