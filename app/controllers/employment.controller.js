const db = require('../models');

const { Employment, User } = db;

// Get all users that are employeed by a user (company)
exports.userIsEmployedBy = async (req, res, next) => {
  const {
    params: { userId },
  } = req;

  User.findById(userId)
    .then((user) => user.employedBy())
    .then((employees) => {
      return res.status(200).send({
        message: 'Employees sent successfully',
        data: employees,
      });
    })
    .catch((err) => next(err));
};

// Create entry in Employment
exports.employOneUser = async (req, res, next) => {
  const {
    body: { employeeId },
    params: { userId },
  } = req;

  User.findById(employeeId)
    .then(() => {
      if (employeeId === userId) {
        throw new StatusError('Employment already exists', 409);
      }
    })
    .then(() => Employment.employ(userId, employeeId))
    .then(() => {
      return res.status(200).send({
        message: 'Employee added successfully',
      });
    })
    .catch((err) => next(err));
};

// Delete entry in Employment
// exports.unemployOneUser = async (req, res, next) => {
//   const {
//     body: { employeeId },
//     params: { userId },
//   } = req;

//   User.findById(employeeId)
//     .then(() => Employment.deleteEmplyoment(userId, employeeId))
//     .then(() => {
//       return res.status(200).send({
//         message: 'Employment deleted successfully',
//       });
//     })
//     .catch((err) => next(err));
// };
