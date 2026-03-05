const { z } = require('zod');

const patchAnimalSchema = z.object({
  body: z.strictObject({
    name: z.string().optional(),
    chip_id: z.int().optional(),
    dob: z.coerce.date().optional(),
    sex: z.enum(['MALE', 'FEMALE']).optional(),
    species: z.enum(['CAT', 'DOG']).optional(),
    foster_status: z.enum(['SHELTERED', 'FOSTERED', 'ADOPTED']).optional(),
    kennel_id: z.int().optional(),
    altered: z.boolean().optional(),
    weight: z.number().nonnegative().optional(),
    last_modified: z.coerce.date().optional(),
    picture: z.string().optional(),
    modified_by: z.uuid(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}).optional(),
});

module.exports = patchAnimalSchema;
