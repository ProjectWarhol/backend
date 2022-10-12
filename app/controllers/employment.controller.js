const db = require('../models');

const { Company, User } = db;

// Retrieve all employees of a company

exports.retrieveEmployees = (req, res, next) => {
  const {
    body: { id },
  } = req;

  Company.findById(id).then((company) => {
    User.findAll({
      where: {
        companyId: company.id,
      },
    })
      .then((users) => {
        console.log({ users });
        res.status(200).json(users);
      })
      .catch((err) => {
        next(err);
      });
  });
};

// Create emplyoment

exports.createEmployment = (req, res, next) => {
  const {
    body: { userId, companyId },
  } = req;

  User.findById(userId).then((user) => {
    user.update({
      companyId,
    });
    user
      .save()
      .then(() => {
        console.log({ user });
        return res.status(200).send({
          message: 'Employment created successfully',
        });
      })
      .catch((err) => next(err));
  });
};

// Delete employment

exports.deleteEmployment = (req, res, next) => {
  const {
    body: { userId },
  } = req;

  User.findById(userId).then((user) => {
    user.update({
      companyId: null,
    });
    user
      .save()
      .then(() => {
        return res.status(200).send({
          message: 'Employment deleted successfully',
        });
      })
      .catch((err) => next(err));
  });
};

// Update employment

exports.updateEmployment = (req, res, next) => {
  const {
    body: { userId, companyId },
  } = req;

  User.findById(userId).then((user) => {
    user.update({
      companyId,
    });
    user
      .save()
      .then(() => {
        return res.status(200).send({
          message: 'Employment updated successfully',
        });
      })
      .catch((err) => next(err));
  });
};
