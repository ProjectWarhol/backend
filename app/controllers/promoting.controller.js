const db = require('../models');
const errHandler = require('../middlewares/error_handlers.middleware');
const { sessionObject } = require('../util/sessionObject');

const {
  Promoting,
  User,
  Sequelize: { Op },
} = db;

// Get all users that a user with promoterId promotes
exports.userPromotes = (req, res, next) => {
  const {
    body: { promoterId },
  } = req;

  User.findAll({
    include: {
      model: Promoting,
      attributes: [],
      required: true,
      where: { promoterId },
    }
  })
    .then((userData) => {
      res.status(200).send({
        message: 'Promoting data sent successfully',
        data: userData.map(data => sessionObject(data)),
      });
    })
    .catch((err) => {
      next(errHandler.defaultErrorHandler(err));
    });
};

exports.createUserPromotes = (req, res, next) => {
  const {
    body: { promoterId, userId },
  } = req;

  Promoting.findOrCreate({
    where: {
      [Op.and]: [
        { promoterId }, 
        { userId }
      ],
    },
    defaults: {
      ...{ promoterId },
      ...{ userId },
    },
  })
    // eslint-disable-next-line no-unused-vars
    .then(([newPromoting, created]) => {
      if (created) {
        User.increment('promoting', {
          where: {
            id: promoterId,
          },
        })
          .then(() => {
            User.increment('promoters', {
              where: {
                id: userId,
              },
            });
          })
            .then(() => {
              res.status(200).send({
                message: 'Promotion added successfully',
              });
            });
      } else {
        res.status(409).send({
          message: 'Already promoting',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};
