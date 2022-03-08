const { Sequelize } = require('../models');
const db = require('../models');
const { sessionObject } = require('../util/sessionObject');

const {
  Promoting,
  User,
  Sequelize: { Op },
} = db;

const defaultPromotingError = (err) => {
  const error = new Error('Something went wrong');
  error.status = 500;
  error.err = err;
  return error;
};

const incrementPromoting = async (promoterId, userId) => {
  const updatedUsers = {};

  updatedUsers.promoter = await User.increment('promoting', {
    where: {
      id: promoterId,
    },
  });

  updatedUsers.promoted = await User.increment('promoters', {
    where: {
      id: userId,
    },
  });

  updatedUsers.promoter = sessionObject(updatedUsers.promoter[0][0][0]);
  updatedUsers.promoted = sessionObject(updatedUsers.promoted[0][0][0]);
  return updatedUsers;
};

const decrementPromoting = async (promoterId, userId) => {
  const updatedUsers = {};

  updatedUsers.promoter = await User.decrement('promoting', {
    where: {
      id: promoterId,
    },
  });

  updatedUsers.promoted = await User.decrement('promoters', {
    where: {
      id: userId,
    },
  });

  updatedUsers.promoter = sessionObject(updatedUsers.promoter[0][0][0]);
  updatedUsers.promoted = sessionObject(updatedUsers.promoted[0][0][0]);
  return updatedUsers;
};

// Get all users that a user with promoterId promotes
exports.userPromoting = (req, res, next) => {
  const {
    body: { promoterId },
  } = req;

  User.findAll({
    include: {
      model: Promoting,
      attributes: [],
      required: true,
      where: { promoterId },
    },
  })
    .then((userData) => {
      const userObjects = userData.map((data) => sessionObject(data));
      res.status(200).send({
        message: 'Promoting data sent successfully',
        data: userObjects,
      });
    })
    .catch((err) => {
      next(defaultPromotingError(err));
    });
};

// Get all users that promote a user with userId
exports.userIsPromoted = (req, res, next) => {
  const {
    body: { userId },
  } = req;

  User.findAll({
    include: {
      model: Promoting,
      attributes: [],
      required: true,
      on: {
        promoterId: { [Op.eq]: Sequelize.col('User.id') },
      },
      where: { userId },
    },
  })
    .then((userData) => {
      const userObjects = userData.map((data) => sessionObject(data));
      res.status(200).send({
        message: 'Promoting data sent',
        data: userObjects,
      });
    })
    .catch((err) => {
      next(defaultPromotingError(err));
    });
};

// Create entry in Promoting
exports.promotingOneUser = (req, res, next) => {
  const {
    body: { promoterId },
    params: { userId },
  } = req;

  Promoting.findOrCreate({
    where: {
      [Op.and]: [{ promoterId }, { userId }],
    },
    defaults: {
      ...{ promoterId },
      ...{ userId },
    },
  })
    // eslint-disable-next-line no-unused-vars
    .then(async ([newPromoting, created]) => {
      if (created) {
        let updatedUsers;
        try {
          updatedUsers = await incrementPromoting(promoterId, userId);
        } catch (err) {
          next(defaultPromotingError(err));
        }

        res.status(200).send({
          message: 'Promotion added successfully',
          ...updatedUsers,
        });
      } else {
        res.status(409).send({
          message: 'Already promoting user',
        });
      }
    })
    .catch((err) => {
      next(defaultPromotingError(err));
    });
};

// Delete entry in Promoting
exports.unpromotingOneUser = (req, res, next) => {
  const {
    body: { promoterId },
    params: { userId },
  } = req;

  Promoting.destroy({
    where: {
      [Op.and]: [{ promoterId }, { userId }],
    },
  })
    .then(async (destroyed) => {
      if (destroyed) {
        let updatedUsers;
        try {
          updatedUsers = await decrementPromoting(promoterId, userId);
        } catch (err) {
          next(defaultPromotingError(err));
        }

        res.status(200).send({
          message: 'Promotion deleted successfully',
          ...updatedUsers,
        });
      } else {
        res.status(409).send({
          message: 'Promotion not found',
        });
      }
    })
    .catch((err) => {
      next(defaultPromotingError(err));
    });
};
