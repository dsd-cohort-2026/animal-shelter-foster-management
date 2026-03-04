const { jwtVerify } = require('jose');
const PROJECT_JWKS = require('../connections/jwks-key');
const prisma = require('../connections/prisma-client');

module.exports = authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      const err = new Error('No token found!');
      err.statusCode = 401;
      return next(err);
    }

    const { payload } = await jwtVerify(token, PROJECT_JWKS);

    if (payload.role !== 'authenticated') {
      const err = new Error('Not Authorized!');
      err.statusCode = 401;
      return next(err);
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: payload.sub },
    });

    if (user.role !== 'STAFF') {
      const err = new Error('You are not permitted to do this!');
      err.statusCode = 403;
      return next(err);
    }
    next();
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
};
