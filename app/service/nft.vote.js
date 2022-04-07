const Sequelize = require('sequelize');
const db = require('../models');
const {
  defaultErrorHandler,
  defaultConflictHandler,
  noPathErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { NftVote } = db;

exports.getVotes = async (nft, res) => {
  const upvotes = await nft
    .countNftVotes({ where: { type: true } })
    .catch(() =>
      defaultErrorHandler(res, 'Something went wrong while fetching votes')
    );
  if (res.headersSent) return;
  const downvotes = await nft
    .countNftVotes({ where: { type: false } })
    .catch(() =>
      defaultErrorHandler(res, 'Something went wrong while fetching votes')
    );

  // eslint-disable-next-line consistent-return
  return { ...{ upvotes }, ...{ downvotes } };
};

exports.createVote = async (contentId, userId, type, res) => {
  const newVote = await NftVote.create({
    ...{ contentId },
    ...{ userId },
    ...{ type },
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      defaultConflictHandler(res, 'Vote already exists');
    } else {
      defaultErrorHandler(res, 'Something went wrong while creating vote');
    }
  });

  return newVote !== undefined;
};

exports.deleteVote = async (contentId, userId, res) => {
  const destroyed = await NftVote.destroy({
    where: {
      ...{ contentId },
      ...{ userId },
    },
    individualHooks: true,
  }).catch(() => {
    defaultErrorHandler(res, 'Something went wrong while deleting vote');
  });

  if (!destroyed) {
    noPathErrorHandler(res, 'Vote');
  }

  return destroyed;
};

exports.updateVote = async (contentId, userId, res) => {
  const updated = await NftVote.update(
    {
      type: Sequelize.literal('NOT type'),
    },
    {
      where: {
        ...{ contentId },
        ...{ userId },
      },
      individualHooks: true,
    }
  ).catch(() => {
    defaultErrorHandler(res, 'Something went wrong while updating vote');
  });

  if (updated && !updated[0]) {
    noPathErrorHandler(res, 'Vote');
  }

  return updated;
};
