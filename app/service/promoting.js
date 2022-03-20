const { sessionObject } = require('../util/sessionObject');
const db = require('../models');

const { User } = db;

exports.incrementPromoting = async (userId, promotedId) => {
  const updatedUsers = {};

  updatedUsers.promoter = await User.increment('promoting', {
    where: {
      id: userId,
    },
  });

  updatedUsers.promoted = await User.increment('promoters', {
    where: {
      id: promotedId,
    },
  });

  updatedUsers.promoter = sessionObject(updatedUsers.promoter[0][0][0]);
  updatedUsers.promoted = sessionObject(updatedUsers.promoted[0][0][0]);
  return updatedUsers;
};

exports.decrementPromoting = async (userId, promotedId) => {
  const updatedUsers = {};

  updatedUsers.promoter = await User.decrement('promoting', {
    where: {
      id: userId,
    },
  });

  updatedUsers.promoted = await User.decrement('promoters', {
    where: {
      id: promotedId,
    },
  });

  updatedUsers.promoter = sessionObject(updatedUsers.promoter[0][0][0]);
  updatedUsers.promoted = sessionObject(updatedUsers.promoted[0][0][0]);
  return updatedUsers;
};
