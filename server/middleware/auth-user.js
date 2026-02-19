const { jwtVerify } = require('jose');
const PROJECT_JWKS = require('../connections/jwks-key');

module.exports = authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    const err = new Error('No token found!');
    err.statusCode = 401;
    return next(err);
  }

  const { payload } = await jwtVerify(token, PROJECT_JWKS);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload.sub },
  });

  if (user.role !== 'STAFF' && user.role !== 'USER') {
    const err = new Error('You are not authorized to do this!');
    err.statusCode = 401;
    return next(err);
  }
  next();
};
