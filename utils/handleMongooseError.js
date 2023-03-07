const handleMongooseError = (err, data, next) => {
  err.status =
    (err.name === "MongoServerError" && err.code === 11000) ? 409 : 400;
  next();
};

module.exports = handleMongooseError;
