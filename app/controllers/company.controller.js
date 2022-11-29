const db = require('../models');

const { Company } = db;

// Create a company
exports.createOneCompany = (req, res, next) => {
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

  Company.createCompany(
    userId,
    companyName,
    website,
    primaryColor,
    secondaryColor,
    address,
    logo,
    bio
  )
    .then((company) => {
      res.status(200).send({
        message: 'Company created successfully',
        data: company,
      });
    })
    .catch((err) => next(err));
};

// Delete a company
exports.deleteOneCompany = (req, res, next) => {
  const {
    body: { id, userId },
  } = req;

  Company.findById(id)
    .then((company) => {
      if (company.ownerUserId !== userId)
        throw new StatusError('unauthorized', 401);
      return company.destroy();
    })
    .then(() => {
      return res.status(200).send({
        message: 'Company deleted successfully',
      });
    })
    .catch((err) => next(err));
};

// Patch a company
exports.patchOneCompany = (req, res, next) => {
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
      if (company.ownerUserId !== userId)
        throw new StatusError('unauthorized', 401);
      return Company.patchCompany(
        id,
        companyName,
        website,
        primaryColor,
        secondaryColor,
        address,
        logo,
        bio
      );
    })
    .then((company) => {
      return res.status(200).send({
        message: 'Company updated successfully',
        data: company,
      });
    })
    .catch((err) => next(err));
};
