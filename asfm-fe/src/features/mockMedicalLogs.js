// Mock data matching server Prisma MedicalLog model
// Updated with dates for testing "today" and "this week" filter
// Current date: 2026-03-07 (Saturday)

const today = new Date();
const formatDate = (date) => date.toISOString();

// Create dates for testing
const todayDate = new Date(today);
todayDate.setHours(10, 30, 0, 0); // 10:30 AM today

const yesterdayDate = new Date(today);
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
yesterdayDate.setHours(14, 0, 0, 0); // 2:00 PM yesterday

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
twoDaysAgo.setHours(9, 0, 0, 0); // 9:00 AM

const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
threeDaysAgo.setHours(11, 45, 0, 0); // 11:45 AM

const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
fourDaysAgo.setHours(8, 20, 0, 0); // 8:20 AM

const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
fiveDaysAgo.setHours(15, 30, 0, 0); // 3:30 PM

const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
lastWeek.setHours(13, 0, 0, 0); // 1:00 PM last week

const twoWeeksAgo = new Date(today);
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
twoWeeksAgo.setHours(10, 0, 0, 0); // 10:00 AM two weeks ago

export const mockMedicalLogs = [
  // TODAY - Multiple entries for testing
  {
    id: 'ml-today-1',
    logged_at: formatDate(todayDate),
    category: 'MEDICAL',
    general_notes: 'Annual vaccination — rabies booster administered (TODAY).',
    behavior_notes: null,
    qty_administered: 1.0,
    dose: '1 mL',
    administered_at: formatDate(new Date(todayDate.getTime() - 15 * 60 * 1000)), // 15 min before logged
    prescription: null,
    documents: null,
    foster_user_id: null,
    animal_id: '1',
    animal_name: 'Chewy',
    assignment_id: null,
    medication_id: null,
  },
  {
    id: 'ml-today-2',
    logged_at: formatDate(todayDate),
    category: 'BEHAVIORAL',
    general_notes: null,
    behavior_notes: 'Playful and social today - great progress!',
    qty_administered: null,
    dose: null,
    administered_at: null,
    prescription: null,
    documents: null,
    foster_user_id: 'foster-user-1',
    animal_id: '2',
    animal_name: 'Bailey',
    assignment_id: null,
    medication_id: null,
  },
  // YESTERDAY
  {
    id: 'ml-yesterday-1',
    logged_at: formatDate(yesterdayDate),
    category: 'VETERINARY',
    general_notes: 'Spay surgery completed without complications (YESTERDAY).',
    behavior_notes: null,
    qty_administered: null,
    dose: null,
    administered_at: null,
    prescription: 'Carprofen 25mg twice daily for 5 days',
    documents: null,
    foster_user_id: null,
    animal_id: '3',
    animal_name: 'Luna',
    assignment_id: null,
    medication_id: null,
  },
  // 2 DAYS AGO
  {
    id: 'ml-2days-1',
    logged_at: formatDate(twoDaysAgo),
    category: 'MEDICAL',
    general_notes: 'Flea treatment applied. No adverse reactions (2 DAYS AGO).',
    behavior_notes: null,
    qty_administered: 1.0,
    dose: '0.5 mL topical',
    administered_at: formatDate(new Date(twoDaysAgo.getTime() - 15 * 60 * 1000)),
    prescription: null,
    documents: null,
    foster_user_id: 'foster-user-1',
    animal_id: '7',
    animal_name: 'Shadow',
    assignment_id: null,
    medication_id: null,
  },
  // 3 DAYS AGO
  {
    id: 'ml-3days-1',
    logged_at: formatDate(threeDaysAgo),
    category: 'BEHAVIORAL',
    general_notes: null,
    behavior_notes: 'Aggressive toward other dogs during group play (3 DAYS AGO).',
    qty_administered: null,
    dose: null,
    administered_at: null,
    prescription: null,
    documents: null,
    foster_user_id: null,
    animal_id: '8',
    animal_name: 'Buddy',
    assignment_id: null,
    medication_id: null,
  },
  // 4 DAYS AGO
  {
    id: 'ml-4days-1',
    logged_at: formatDate(fourDaysAgo),
    category: 'VETERINARY',
    general_notes: 'Dental cleaning performed (4 DAYS AGO).',
    behavior_notes: null,
    qty_administered: null,
    dose: null,
    administered_at: null,
    prescription: 'Amoxicillin 50mg twice daily for 7 days',
    documents: null,
    foster_user_id: null,
    animal_id: '5',
    animal_name: 'Whiskers',
    assignment_id: null,
    medication_id: null,
  },
  // 5 DAYS AGO
  {
    id: 'ml-5days-1',
    logged_at: formatDate(fiveDaysAgo),
    category: 'MEDICAL',
    general_notes: 'Deworming treatment administered (5 DAYS AGO).',
    behavior_notes: null,
    qty_administered: 2.0,
    dose: '2 tablets',
    administered_at: formatDate(new Date(fiveDaysAgo.getTime() - 15 * 60 * 1000)),
    prescription: null,
    documents: null,
    foster_user_id: 'foster-user-2',
    animal_id: '2',
    animal_name: 'Bailey',
    assignment_id: null,
    medication_id: null,
  },
  // LAST WEEK - Should be EXCLUDED by "this week" filter
  {
    id: 'ml-lastweek-1',
    logged_at: formatDate(lastWeek),
    category: 'BEHAVIORAL',
    general_notes: null,
    behavior_notes: 'Improved socialization with other cats (LAST WEEK - should be filtered out).',
    qty_administered: null,
    dose: null,
    administered_at: null,
    prescription: null,
    documents: null,
    foster_user_id: 'foster-user-1',
    animal_id: '10',
    animal_name: 'Milo',
    assignment_id: null,
    medication_id: null,
  },
  // TWO WEEKS AGO - Should be EXCLUDED by "this week" filter
  {
    id: 'ml-2weeks-1',
    logged_at: formatDate(twoWeeksAgo),
    category: 'MEDICAL',
    general_notes: 'Routine checkup completed (TWO WEEKS AGO - should be filtered out).',
    behavior_notes: null,
    qty_administered: null,
    dose: null,
    administered_at: null,
    prescription: null,
    documents: null,
    foster_user_id: null,
    animal_id: '1',
    animal_name: 'Chewy',
    assignment_id: null,
    medication_id: null,
  },
];
