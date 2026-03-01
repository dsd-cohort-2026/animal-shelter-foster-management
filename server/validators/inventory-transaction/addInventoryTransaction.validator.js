const { z } = require('zod');

const addInventoryTransactionSchema = z.object({
  body: z.object({
    quantity: z.int().nonnegative(),
    status: z.enum(['ACTIVE', 'COMPLETE']),
    type: z.enum(['DISTRIBUTION', 'LOAN', 'INTAKE']),
    notes: z.string().min(1),
    foster_user_id: z.uuid().optional(),
    created_by_staff_user_id: z.uuid(),
    item_id: z.uuid(),
    inventory_id: z.uuid(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = addInventoryTransactionSchema;
