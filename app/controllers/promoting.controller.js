const db = require('../models');

const { Promoting, User } = db;

// Get all users that a user with userId promotes
exports.userPromoting = async (req, res, next) => {
  const {
    params: { userId },
  } = req;

  User.findById(userId)
    .then((user) => user.promotes())
    .then((promotions) => {
      return res.status(200).send({
        message: 'Promotions sent successfully',
        data: promotions,
      });
    })
    .catch((err) => next(err));
};

// Get all users that promote a user with promotedId
exports.userIsPromoted = async (req, res, next) => {
  const {
    params: { promotedId },
  } = req;

  User.findById(promotedId)
    .then((user) => user.promotedBy())
    .then((promoters) => {
      return res.status(200).send({
        message: 'Promoters sent successfully',
        data: promoters,
      });
    })
    .catch((err) => next(err));
};

// Get users that LOGGED IN user promotes
exports.sessionPromotes = (req, res, next) => {
  const { user } = req;

  user
    .promotes()
    .then((promotions) => {
      return res.status(200).send({
        message: 'Promotions sent successfully',
        data: promotions,
      });
    })
    .catch((err) => next(err));
};

// Get users that LOGGED IN user is promoted by
exports.sessionPromoted = (req, res, next) => {
  const { user } = req;

  user
    .promotedBy()
    .then((promoters) => {
      return res.status(200).send({
        message: 'Promoters sent successfully',
        data: promoters,
      });
    })
    .catch((err) => next(err));
};

// Create entry in Promoting
exports.promotingOneUser = async (req, res, next) => {
  const {
    params: { promotedId },
  } = req;

  User.findById(promotedId)
    .then(() => Promoting.createPromotion(req.user.id, promotedId))
    .then(() => {
      return res.status(200).send({
        message: 'Promotion created successfully',
      });
    })
    .catch((err) => next(err));
};

// Delete entry in Promoting
exports.unpromotingOneUser = async (req, res, next) => {
  const {
    params: { promotedId },
  } = req;

  User.findById(promotedId)
    .then(() => Promoting.deletePromotion(req.user.id, promotedId))
    .then(() => {
      return res.status(200).send({
        message: 'Promotion deleted successfully',
      });
    })
    .catch((err) => next(err));
};
