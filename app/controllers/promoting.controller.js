const { Sequelize } = require('../models');
const db = require('../models');
const { sessionObject } = require('../util/sessionObject');

const {
  Promoting,
  User,
  Sequelize: { Op },
} = db;

const defaultPromotingError = new Error('Something went wrong');
defaultPromotingError.status = 500;

// eslint complains if i wrap a single return statement in curly braces
// will delete comment if pr is approved
// dont hurt me habibi
const incrementPromoting = (promoterId, userId) =>
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
      });

const decrementPromoting = (promoterId, userId) =>
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
    });

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
    }
  })
    .then((userData) => {
      res.status(200).send({
        message: 'Promoting data sent successfully',
        data: userData.map(data => sessionObject(data)),
      });
    })
    .catch((err) => {
      defaultPromotingError.err = err;
      next(defaultPromotingError);
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
      const userObjects = userData.map(data => sessionObject(data));
      res.status(200).send({
        message: 'Promoting data sent',
        data: userObjects,
      });
    })
    .catch((err) => {
      defaultPromotingError.err = err;
      next(defaultPromotingError);
    });
};

// Create entry in Promoting
exports.promotingOneUser = (req, res, next) => {
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
        incrementPromoting(promoterId, userId)
          .then(() => {
            res.status(200).send({
              message: 'Promotion added successfully',
            });
          });
      } else {
        res.status(409).send({
          message: 'Already promoting user',
        });
      }
    })
    .catch((err) => {
      defaultPromotingError.err = err;
      next(defaultPromotingError);
    });
};

// Delete entry in Promoting
exports.unpromotingOneUser = (req, res, next) => {
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
        decrementPromoting(promoterId, userId)
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
      defaultPromotingError.err = err;
      next(defaultPromotingError);
    });
};
