const { jwtVerify } = require('jose');
const PROJECT_JWKS = require('../connections/jwks-key');
const prisma = require('../connections/prisma-client');

module.exports = authOptional = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const { payload } = await jwtVerify(token, PROJECT_JWKS);

    if (payload.role !== 'authenticated' || !payload.sub) {
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || (user.role !== 'STAFF' && user.role !== 'USER')) {
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};
