const db = require('../models');

const { Company, User } = db;

// Create a company
exports.createOneCompany = async (req, res, next) => {
  const {
    params: { userId },
    body: {
      companyName,
      website,
      primaryColor,
      secondaryColor,
      address,
      logo,
      bio,
    },
  } = req;

  Company.createCompany(
    companyName,
    website,
    primaryColor,
    secondaryColor,
    address,
    logo,
    bio
  )
    .then(() => {
      User.setCompanyOwner(userId);
    })
    .then((company) => {
      res.status(200).send({
        message: 'Company created successfully',
        data: company,
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
        throw new StatusError('unauthorized', 401);
      }
      return company.destroy();
    })
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      user.update({ isCompanyOwner: false });
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
