const { z } = require('zod');

const getAllMedicalLogsSchema = z.object({
  body: z.object({}).optional(),
  params: z.strictObject({}),
  query: z.strictObject({}),
});

module.exports = getAllMedicalLogsSchema;