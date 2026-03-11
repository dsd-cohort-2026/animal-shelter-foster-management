/**
 * Format ISO date string to localized datetime string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or '—' if empty
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString();
};

/**
 * Calculate category statistics for medical logs
 * @param {Array} logs - Medical logs
 * @returns {Object} Statistics { total, medical, behavioral, veterinary }
 */
export const calculateLogStats = (logs) => {
  // Guard against non-array input to prevent runtime crashes
  if (!Array.isArray(logs)) {
    return { total: 0, medical: 0, behavioral: 0, veterinary: 0 };
  }
  return {
    total: logs.length,
    medical: logs.filter((l) => l.category === 'MEDICAL').length,
    behavioral: logs.filter((l) => l.category === 'BEHAVIORAL').length,
    veterinary: logs.filter((l) => l.category === 'VETERINARY').length,
  };
};

/**
 * Base column definitions for medical logs table
 * Shared between admin and foster views
 * Admin view adds: created_by_type, creator_name after administered_at
 */
export const MEDICAL_LOG_BASE_COLUMNS = [
  { accessorKey: 'animal_name', header: 'Animal', textSize: 'sm' },
  {
    accessorKey: 'logTypeBadge',
    header: 'Log Type',
    headClassName: 'text-center',
    cellClassName: 'text-center',
    textSize: 'sm',
  },
  { accessorKey: 'dose', header: 'Dose', textSize: 'sm' },
  { accessorKey: 'qty_administered', header: 'Qty', textSize: 'sm' },
  { accessorKey: 'administered_at', header: 'Administered At', textSize: 'sm' },
  { accessorKey: 'logged_at', header: 'Logged At', textSize: 'sm' },
  {
    accessorKey: 'prescription',
    header: 'Prescription',
    cellClassName: 'whitespace-normal max-w-md',
    textSize: 'sm',
  },
  {
    accessorKey: 'general_notes',
    header: 'General Notes',
    cellClassName: 'whitespace-normal max-w-md',
    textSize: 'sm',
  },
  {
    accessorKey: 'behavior_notes',
    header: 'Behavior Notes',
    cellClassName: 'whitespace-normal max-w-md',
    textSize: 'sm',
  },
];
