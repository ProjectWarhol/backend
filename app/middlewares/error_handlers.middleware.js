// for not found paths
// eslint-disable-next-line no-unused-vars
exports.noPathErrorHandler = (res, message) => {
  res.status(404).send({
    error: {
      status: 404,
      message: `${message} Not found`,
    },
  });
};

// eslint-disable-next-line no-unused-vars
exports.defaultErrorHandler = (err, res, message) => {
  res.status(500).send({
    error: {
      status: 500,
      message: `Internal Server Error: ${message}`,
    },
  });
};

// eslint-disable-next-line no-unused-vars
exports.defaultWrongInputHandler = (res, message) => {
  res.status(422).send({
    error: {
      status: 422,
      message: `Unprocessable Entity: ${message}`,
    },
  });
};
