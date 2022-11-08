const db = require('../models');

const {
  Sequelize: { Op },
  NftContent,
} = db;

// Retrieve comments on picture
exports.retrieveFiltered = (req, res, next) => {
  const {
    body: { companyId, categories, offset = 0 },
  } = req;

  // prep categories filter
  let filter;
  try {
    filter = JSON.parse(categories).map((elem) => ({ [Op.contains]: [elem] }));
  } catch {
    filter = null;
  }

  if (companyId && filter) {
    return NftContent.findAll({
      where: {
        [Op.and]: [
          { companyId },
          {
            categories: {
              [Op.or]: filter,
            },
          },
        ],
      },
      offset,
      limit: 20,
    })
      .then((content) => {
        res.status(200).json({
          message: 'Contents retrieved',
          data: content,
        });
      })
      .catch((err) => next(err));
  }
  if (companyId) {
    return NftContent.findAll({
      where: { companyId },
      offset,
      limit: 20,
    })
      .then((content) => {
        res.status(200).json({
          message: 'Contents retrieved',
          data: content,
        });
      })
      .catch((err) => next(err));
  }
  if (filter) {
    return NftContent.findAll({
      where: {
        categories: {
          [Op.or]: filter,
        },
      },
      offset: Number(offset),
      limit: 20,
    })
      .then((content) => {
        res.status(200).json({
          message: 'Contents retrieved',
          data: content,
        });
      })
      .catch((err) => next(err));
  }

  return res.status(200).json({
    message: 'No content',
    data: [],
  });
};
