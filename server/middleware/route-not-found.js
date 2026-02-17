module.exports = routeNotFoundHandler = (req, res, next) => {
  const err = new Error("Route not found!");
  err.statusCode = 404;
  next(err);
};
