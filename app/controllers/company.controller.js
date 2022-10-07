const db = require('../models');

const {
  Company,
  User,
  Sequelize: { Op },
} = db;

// Create a company
exports.createCompany = async (req, res, next) => {
  const {
    body: {
      userId,
      companyName,
      website,
      primaryColor,
      secondaryColor,
      address,
      logo,
      bio,
    },
  } = req;

  User.findById(userId)
    .then((user) => {
      const ownerUserId = user.id;
      Company.findOrCreate({
        where: {
          [Op.or]: [{ companyName }, { website }, { ownerUserId }],
        },
        defaults: {
          companyName,
          website,
          ownerUserId,
          primaryColor: primaryColor || '#000000',
          secondaryColor: secondaryColor || '#000000',
          address: address || '',
          logo: logo || 'https://pbs.twimg.com/media/FB6YhR8WQAI5MnM.png',
          bio: bio || '',
          createdAt: Date.now(),
        },
      }).then(([company, created]) => {
        if (!created) {
          return res.status(400).send({
            message: 'Company already exists or user is already owner',
          });
        }
        return res.status(200).send({
          message: 'Company created successfully',
          data: company,
        });
      });
    })
    .catch((err) => next(err));
};
