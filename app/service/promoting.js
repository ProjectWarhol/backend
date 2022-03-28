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
