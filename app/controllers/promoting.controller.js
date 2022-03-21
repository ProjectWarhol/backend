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
exports.unpromotingOneUser = async (req, res) => {
  const {
    body: { userId },
    params: { promotedId },
  } = req;

  const destroyed = await deletePromotion(userId, promotedId, res);
  if (!destroyed) return;

  res.status(200).send({
    message: 'Promotion deleted successfully',
  });
};
