const db = require('../models');

const { NftContent, NftVote } = db;

exports.retrieveNftVotes = async (req, res, next) => {
  const {
    params: { id },
  } = req;

  NftContent.findById(id)
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

exports.createNftVote = async (req, res, next) => {
  const {
    params: { id },
    body: { type, userId },
  } = req;

  NftContent.findById(id)
    .then((nft) => nft.createVote(userId, type))
    .then(() => {
      return res.status(200).send({
        message: 'Vote created successfully',
      });
    })
    .catch((err) => next(err));
};

exports.deleteNftVote = async (req, res, next) => {
  const {
    params: { id },
    body: { userId },
  } = req;

  NftVote.findByContentAndUserId(id, userId)
    .then((vote) => vote.destroy())
    .then(() => {
      return res.status(200).send({
        message: 'Vote deleted successfully',
      });
    })
    .catch((err) => next(err));
};

exports.updateNftVote = async (req, res, next) => {
  const {
    params: { id },
    body: { userId },
  } = req;

  NftVote.findByContentAndUserId(id, userId)
    .then((vote) => vote.switchType())
    .then(() => {
      return res.status(200).send({
        message: 'Vote updated successfully',
      });
    })
    .catch((err) => next(err));
};
