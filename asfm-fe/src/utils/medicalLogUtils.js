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
  { accessorKey: 'animal_name', header: 'Animal', headClassName: 'min-w-[110px]', textSize: 'sm' },
  {
    accessorKey: 'logTypeBadge',
    header: 'Log Type',
    headClassName: 'min-w-[130px] text-left',
    cellClassName: 'min-w-[130px] text-left',
    textSize: 'sm',
  },
  {
    accessorKey: 'medication_name',
    header: 'Medication',
    headClassName: 'min-w-[170px]',
    cellClassName: 'whitespace-normal break-words min-w-[170px]',
    textSize: 'sm',
  },
  // Medical-related fields grouped together
  {
    accessorKey: 'prescription',
    header: 'Prescription',
    headClassName: 'min-w-[220px]',
    cellClassName: 'whitespace-normal break-words min-w-[220px]',
    textSize: 'sm',
  },
  {
    accessorKey: 'dose',
    header: 'Dose',
    headClassName: 'min-w-[110px]',
    cellClassName: 'min-w-[110px] whitespace-nowrap',
    textSize: 'sm',
  },
  {
    accessorKey: 'qty_administered',
    header: 'Qty',
    headClassName: 'min-w-[80px]',
    cellClassName: 'min-w-[80px] whitespace-nowrap',
    textSize: 'sm',
  },
  {
    accessorKey: 'administered_at',
    header: 'Administered At',
    headClassName: 'min-w-[170px]',
    cellClassName: 'min-w-[170px] whitespace-nowrap',
    textSize: 'sm',
  },
  {
    accessorKey: 'logged_at',
    header: 'Logged At',
    headClassName: 'min-w-[170px]',
    cellClassName: 'min-w-[170px] whitespace-nowrap',
    textSize: 'sm',
  },
  {
    accessorKey: 'general_notes',
    header: 'General Notes',
    headClassName: 'min-w-[190px]',
    cellClassName: 'whitespace-normal break-words min-w-[190px]',
    textSize: 'sm',
  },
  {
    accessorKey: 'behavior_notes',
    header: 'Behavior Notes',
    headClassName: 'min-w-[190px]',
    cellClassName: 'whitespace-normal break-words min-w-[190px]',
    textSize: 'sm',
  },
];
