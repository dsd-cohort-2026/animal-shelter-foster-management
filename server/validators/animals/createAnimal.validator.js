const { z } = require('zod');

const createAnimalSchema = z.object({
  body: z.object({
    name: z.string(),
    chip_id: z.int(),
    dob: z.coerce.date(),
    sex: z.enum(['MALE', 'FEMALE']),
    species: z.enum(['CAT', 'DOG']),
    foster_status: z.enum(['SHELTERED', 'FOSTERED', 'ADOPTED']),
    kennel_id: z.int(),
    altered: z.boolean(),
    weight: z.number().nonnegative(),
    last_modified: z.coerce.date(),
    // should this be z.url() ?
    picture: z.string(),
    modified_by: z.uuid(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = createAnimalSchema;
