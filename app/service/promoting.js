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
  const promotions = await user
    .getUserPromotions({
      attributes: [],
      include: [User],
    })
    .then((data) => data.map((promotion) => sessionObject(promotion.User)))
    .catch(() => {
      defaultErrorHandler(
        res,
        'Something went wrong while fetching promotions'
      );
    });

  return promotions;
};

exports.getPromoters = async (user, res) => {
  const promoters = await user
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
    .then((data) => data.map((promoter) => sessionObject(promoter.User)))
    .catch(() => {
      defaultErrorHandler(res, 'Something went wrong while fetching promoters');
    });

  return promoters;
};
