const { z } = require('zod');

const updateInventorySchema = z.object({
  body: z.strictObject({
    quantity: z.int().optional(),
    expiration_date: z.coerce.date().optional(),
    item_id: z.uuid().optional(),
    foster_user: z.uuid().optional(),
    staff_user: z.uuid(),
    type: z.enum(['INTAKE', 'DISTRIBUTION', 'LOAN']).optional(),
    status: z.enum(['COMPLETE', 'ACTIVE']).optional(),
    notes: z.string().optional(),
  }),
  params: z.strictObject({ id: z.uuid() }),
  query: z.object({}).optional(),
});

module.exports = updateInventorySchema;
