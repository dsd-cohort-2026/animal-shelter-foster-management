const { z } = require('zod');

const chatValidator = z.object({
  body: z.strictObject({
    messages: z
      .array(
        z.strictObject({
          role: z.enum(['user', 'assistant']),
          content: z.string().trim().min(1),
        }),
      )
      .min(1)
      .max(20, 'A maximum of 20 messages is allowed'),
  }),
  params: z.strictObject({}).optional(),
  query: z.strictObject({}).optional(),
});

module.exports = chatValidator;
