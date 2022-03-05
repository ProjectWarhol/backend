const { Sequelize } = require('../models');
const db = require('../models');
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
      next(err);
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
        'promoterId': { [Op.eq]: Sequelize.col('User.id') },
      },
      where: { userId },
    }
  })
    .then((userData) => {
      res.status(200).send({
        message: 'Promoting data sent successfully',
        data: userData.map(data => sessionObject(data)),
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Create entry in Promoting
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

// Delete entry in Promoting
exports.destroyUserPromotes = (req, res, next) => {
  const {
    body: { promoterId, userId },
  } = req;

  Promoting.destroy({
    where: {
      [Op.and]: [
        { promoterId }, 
        { userId }
      ],
    },
  })
    .then((destroyed) => {
      if (destroyed) {
        User.decrement('promoting', {
          where: {
            id: promoterId,
          },
        })
          .then(() => {
            User.decrement('promoters', {
              where: {
                id: userId,
              },
            });
          })
            .then(() => {
              res.status(200).send({
                message: 'Promotion deleted successfully',
              });
            });
      } else {
        res.status(409).send({
          message: 'Promotion not found',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};
