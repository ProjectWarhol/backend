const db = require('../models');
const errHandler = require('../middlewares/error_handlers.middleware');
const { sessionObject } = require('../util/sessionObject');

const {
  Promoting,
  User,
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
}
