const { z } = require('zod');

const createMedicalLogSchema = z.object({
  body: z.strictObject({
    category: z.enum(['MEDICAL', 'BEHAVIORAL', 'VETERINARY']),
    animal_id: z.uuid(),
    general_notes: z.string().optional(),
    behavior_notes: z.string().optional(),
    qty_administered: z.number().nonnegative().optional(),
    dose: z.string().optional(),
    administered_at: z.coerce.date().optional(),
    prescription: z.string().optional(),
    documents: z.string().optional(),
    foster_user_id: z.uuid().optional(),
    assignment_id: z.uuid().optional(),
    medication_id: z.uuid().optional(),
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

module.exports = createMedicalLogSchema;