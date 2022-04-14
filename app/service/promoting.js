const { Sequelize } = require('../models');
const { sessionObject } = require('../util/sessionObject');
const db = require('../models');
const {
  defaultErrorHandler,
  defaultConflictHandler,
  noPathErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { User, Promoting } = db;

exports.getPromotions = async (user, res) => {
  let promotions = await user
    .getUserPromotions({
      attributes: [],
      include: [User],
    })
    .catch(() => {
      defaultErrorHandler(
        res,
        'Something went wrong while fetching promotions'
      );
    });

  try {
    promotions = promotions.map((promotion) => sessionObject(promotion.User));
  } catch (err) {
    defaultErrorHandler(res, 'Something went wrong while fetching promotions');
  }

  return promotions;
};

exports.getPromoters = async (user, res) => {
  let promoters = await user
    .getUserPromoters({
      attributes: [],
      include: [
        {
          model: User,
          on: {
            id: { [Sequelize.Op.eq]: Sequelize.col('Promoting.userId') },
          },
        },
      ],
    })
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while fetching promoters');
    });

  try {
    promoters = promoters.map((promoter) => sessionObject(promoter.User));
  } catch (err) {
    defaultErrorHandler(res, 'Something went wrong while fetching promoters');
  }

  return promoters;
};

exports.createPromotion = async (userId, promotedId, res) => {
  const newPromotion = await Promoting.create({
    ...{ userId },
    ...{ promotedId },
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      defaultConflictHandler(res, 'Promotion already exists');
    } else if (err.parent.constraint === 'Promoting_promotedId_ck') {
      defaultConflictHandler(res, 'Self-promotion');
    } else {
      defaultErrorHandler(res, 'Something went wrong while creating promotion');
    }
  });

  return newPromotion !== undefined;
};

exports.deletePromotion = async (userId, promotedId, res) => {
  const destroyed = await Promoting.destroy({
    where: {
      ...{ userId },
      ...{ promotedId },
    },
    individualHooks: true,
  }).catch(() => {
    defaultErrorHandler(res, 'Something went wrong while deleting promotion');
  });

  if (!destroyed) {
    noPathErrorHandler(res, 'Promotion');
  }
  return destroyed;
};
