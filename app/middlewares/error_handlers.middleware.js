global.StatusError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// for not found paths
exports.defaultExpirationHandler = (res, message) => {
  res.status(401).send({
    error: {
      status: 401,
      message: `Expired: ${message}`,
    },
  });
};

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

exports.defaultConflictHandler = (res, message) => {
  res.status(409).send({
    error: {
      status: 409,
      message: `Conflict: ${message}`,
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

exports.defaultErrorHandler = (res, message) => {
  res.status(500).send({
    error: {
      status: 500,
      message: `Internal Server Error: ${message}`,
    },
  });
};

exports.defaultPasswordMismatch = (res, message) => {
  res.status(403).send({
    error: {
      status: 403,
      message: `forbidden: ${message}`,
    },
  });
};
