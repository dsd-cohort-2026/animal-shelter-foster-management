const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const err = result.error;
    err.statusCode = 400;
    return next(err);
  }

  return next();
};

module.exports = validate;
