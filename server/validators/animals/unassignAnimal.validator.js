const { z } = require('zod');

const unassignAnimalSchema = z.object({
  body: z.strictObject({
    assigned_by_staff: z.uuid(),
    assignment_id: z.uuid(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}).optional(),
});

module.exports = unassignAnimalSchema;
