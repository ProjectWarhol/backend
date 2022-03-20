const { Sequelize } = require('../models');
const db = require('../models');
const { sessionObject } = require('../util/sessionObject');
const {
  noPathErrorHandler,
  defaultErrorHandler,
  defaultConflictHandler,
} = require('../middlewares/error_handlers.middleware');
const {
  incrementPromoting,
  decrementPromoting,
} = require('../service/promoting');

const {
  Promoting,
  User,
  Sequelize: { Op },
} = db;

const defaultPromotingError = (err) => {
  const error = new Error('Something went wrong');
  error.status = 500;
  if (err.name !== 'SequelizeDatabaseError') {
    error.err = err;
  }
  return error;
};

// Get all users that a user with userId promotes
exports.userPromoting = (req, res, next) => {
  const {
    params: { userId },
  } = req;

  User.findAll({
    include: {
      model: Promoting,
      attributes: [],
      required: true,
      where: { userId },
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

// Get all users that promote a user with promotedId
exports.userIsPromoted = (req, res, next) => {
  const {
    params: { promotedId },
  } = req;

  User.findAll({
    include: {
      model: Promoting,
      attributes: [],
      required: true,
      on: {
        userId: { [Op.eq]: Sequelize.col('User.id') },
      },
      where: { promotedId },
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
    body: { userId },
    params: { promotedId },
  } = req;

  Promoting.findOrCreate({
    where: {
      [Op.and]: [{ userId }, { promotedId }],
    },
    defaults: {
      ...{ userId },
      ...{ promotedId },
    },
  })
    // eslint-disable-next-line no-unused-vars
    .then(async ([newPromoting, created]) => {
      if (created) {
        let updatedUsers;
        try {
          updatedUsers = await incrementPromoting(userId, promotedId);
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
    body: { userId },
    params: { promotedId },
  } = req;

  Promoting.destroy({
    where: {
      [Op.and]: [{ userId }, { promotedId }],
    },
  })
    .then(async (destroyed) => {
      if (destroyed) {
        let updatedUsers;
        try {
          updatedUsers = await decrementPromoting(userId, promotedId);
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
