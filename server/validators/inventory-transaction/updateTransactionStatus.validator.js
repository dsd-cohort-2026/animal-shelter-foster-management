const { z } = require('zod');

const updateTransactionStatusSchema = z.object({
  body: z.strictObject({
    status: z.enum(['ACTIVE', 'COMPLETE']),
    staff_user: z.uuid(),
    quantity: z.int(),
  }),
  params: z.strictObject({ id: z.uuid() }),
  query: z.strictObject({}).optional(),
});

module.exports = updateTransactionStatusSchema;
