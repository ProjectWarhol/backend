const db = require('../models');

const { NftContent } = db;

exports.retrieveNftVotes = async (req, res, next) => {
  const {
    params: { id },
  } = req;

  NftContent.findById(id)
    .then((nft) => nft.getVotes())
    .then((votes) => {
      return res.status(200).send({
        message: 'Votes sent successfully',
        votes: {
          ...votes[0],
          ...votes[1],
        },
      });
    })
    .catch((err) => next(err));
};

exports.createNftVote = async (req, res, next) => {
  const {
    body: { type, userId },
    params: { id },
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

  const destroyed = await deleteVote(id, userId, res);
  if (!destroyed || res.headersSent) return;

  res.status(200).send({
    message: 'Vote successfully deleted',
  });
};

exports.updateNftVote = async (req, res, next) => {
  const {
    params: { id },
    body: { userId },
  } = req;

  const updated = await updateVote(id, userId, res);
  if (!updated || res.headersSent) return;

  res.status(200).send({
    message: 'Vote successfully updated',
  });
};
