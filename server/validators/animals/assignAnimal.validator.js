const { z } = require('zod');

const assignAnimalSchema = z.object({
  body: z.strictObject({
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    status: z.enum(['ACTIVE', 'COMPLETE']),
    new_animal_status: z.enum(['ADOPTED', 'FOSTERED']),
    foster_user: z.uuid(),
    assigned_by_staff: z.uuid(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}).optional(),
});

module.exports = assignAnimalSchema;
