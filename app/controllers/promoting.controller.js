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
exports.userPromoting = async (req, res) => {
  const {
    params: { userId },
  } = req;

  const user = await findUserById(userId, res);
  if (!user) return;

  const promotions = await getPromotions(user, res);
  res.status(200).send(promotions);
};

// Get all users that promote a user with promotedId
exports.userIsPromoted = async (req, res) => {
  const {
    params: { promotedId },
  } = req;

  const user = await findUserById(promotedId, res);
  if (!user) return;

  const promoters = await getPromoters(user, res);
  res.status(200).send(promoters);
};

// Create entry in Promoting
exports.promotingOneUser = async (req, res) => {
  const {
    body: { userId },
    params: { promotedId },
  } = req;

  const created = await createPromotion(userId, promotedId, res);
  if (!created) return;

  res.status(200).send({
    message: 'Promotion added successfully',
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
