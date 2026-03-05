const { z } = require('zod');

const getAllAnimalsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    species: z.enum(['CAT', 'DOG']).optional(),
    foster_status: z.enum(['SHELTERED', 'FOSTERED', 'ADOPTED']).optional(),
    sex: z.enum(['MALE', 'FEMALE']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  }).optional(),
});

module.exports = getAllAnimalsSchema;
