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
      user.update({ isCompanyOwner: true });
      return Company.findOrCreate({
        where: {
          [Op.or]: [{ companyName }, { website }],
        },
        defaults: {
          companyName,
          website,
          ownerUserId: userId,
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

// Delete a company
exports.deleteCompany = async (req, res, next) => {
  const {
    body: { id, userId },
  } = req;

  Company.findById(id)
    .then((company) => {
      if (company.ownerUserId !== userId) {
        return next(new StatusError('unauthorized', 401));
      }
      return company.destroy();
    })
    .then(async () => {
      const owner = await Company.findOne({
        where: {
          ownerUserId: userId,
        },
      });
      if (owner === null) {
        User.findById(userId).then((user) => {
          user.update({ isCompanyOwner: false });
        });
      }
    })
    .then(() => {
      return res.status(200).send({
        message: 'Company deleted successfully',
      });
    })

    .catch((err) => next(err));
};

// Patch a company
exports.patchCompany = async (req, res, next) => {
  const {
    body: {
      id,
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

  Company.findById(id)
    .then((company) => {
      if (company.ownerUserId !== userId) {
        return next(new StatusError('unauthorized', 401));
      }
      return company.update({
        companyName,
        website,
        primaryColor,
        secondaryColor,
        address,
        logo,
        bio,
      });
    })
    .then((company) => {
      return res.status(200).send({
        message: 'Company updated successfully',
        data: company,
      });
    })
    .catch((err) => next(err));
};
