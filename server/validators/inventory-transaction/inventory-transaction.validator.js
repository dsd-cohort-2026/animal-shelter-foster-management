const { z } = require('zod');

const getAll = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z
    .object({
      type: z.enum(['LOAN', 'DISTRIBUTION', 'INTAKE']).optional(),
      status: z.enum(['ACTIVE', 'COMPLETE']).optional(),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(10),
    })
    .optional(),
});

module.exports = { getAll };
