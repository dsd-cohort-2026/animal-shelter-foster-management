const { z } = require('zod');

const usersValidator = {
  getAll: z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
  }),
  getById: z.object({
    body: z.object({}).optional(),
    params: z.object({ id: z.uuid() }),
    query: z.object({}).optional(),
  }),
};

module.exports = usersValidator;
