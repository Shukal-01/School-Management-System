const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: errorHandler.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
