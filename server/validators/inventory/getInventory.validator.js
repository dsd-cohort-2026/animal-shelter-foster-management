const { z } = require('zod');

const getAllInventorySchema = z.object({
  body: z.object({}).optional(),
  params: z.strictObject({}),
  query: z.strictObject({}),
});

module.exports = getAllInventorySchema;
