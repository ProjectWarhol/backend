// for not found paths
// eslint-disable-next-line no-unused-vars
exports.noPathErrorHandler = (req, res, next) => {
  res.status(404).send({
    error: {
      status: 404,
      message: 'Not found',
    },
  });
};

// eslint-disable-next-line no-unused-vars
exports.defaultErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
      err: err.err,
    },
  });
};
