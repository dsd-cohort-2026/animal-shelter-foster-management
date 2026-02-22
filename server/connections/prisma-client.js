const { PrismaClient } = require('../generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });

module.exports = new PrismaClient({ adapter });
