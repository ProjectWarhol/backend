const {
  getPromotions,
  getPromoters,
  createPromotion,
  deletePromotion,
} = require('../service/promoting');
const { findUserById } = require('../service/user');

// Get all users that a user with userId promotes
exports.userPromoting = async (req, res) => {
  const {
    params: { userId },
  } = req;

  const user = await findUserById(userId, res);
  if (!user || res.headersSent) return;

  const promotions = await getPromotions(user, res);
  if (!promotions || res.headersSent) return;

  res.status(200).send({
    message: 'Promotions data sent successfully',
    data: promotions,
  });
};

// Get all users that promote a user with promotedId
exports.userIsPromoted = async (req, res) => {
  const {
    params: { promotedId },
  } = req;

  const user = await findUserById(promotedId, res);
  if (!user || res.headersSent) return;

  const promoters = await getPromoters(user, res);
  if (!promoters || res.headersSent) return;

  res.status(200).send({
    message: 'Promoters data sent successfully',
    data: promoters,
  });
};

// Create entry in Promoting
exports.promotingOneUser = async (req, res) => {
  const {
    body: { userId },
    params: { promotedId },
  } = req;

  const created = await createPromotion(userId, promotedId, res);
  if (!created || res.headersSent) return;

  res.status(200).send({
    message: 'Promotion added successfully',
  });
};

// Delete entry in Promoting
exports.unpromotingOneUser = async (req, res) => {
  const {
    body: { userId },
    params: { promotedId },
  } = req;

  const destroyed = await deletePromotion(userId, promotedId, res);
  if (!destroyed || res.headersSent) return;

  res.status(200).send({
    message: 'Promotion deleted successfully',
  });
};
