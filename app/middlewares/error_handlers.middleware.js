// for not found paths
exports.unauthorizedHandler = (res, message) => {
  res.status(403).send({
    error: {
      status: 403,
      message: `Unauthorized: ${message}`,
    },
  });
};

exports.noPathErrorHandler = (res, message) => {
  res.status(404).send({
    error: {
      status: 404,
      message: `${message} Not found`,
    },
  });
};

exports.defaultErrorHandler = (res, message) => {
  res.status(500).send({
    error: {
      status: 500,
      message: `Internal Server Error: ${message}`,
    },
  });
};

exports.defaultWrongInputHandler = (res, message) => {
  res.status(422).send({
    error: {
      status: 422,
      message: `Unprocessable Entity: ${message}`,
    },
  });
};

exports.defaultConflictHandler = (res, message) => {
  res.status(409).send({
    error: {
      status: 409,
      message: `Conflict: ${message}`,
    },
  });
};
