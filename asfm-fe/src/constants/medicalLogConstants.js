// Log type options matching server schema Log_Type enum
export const LOG_TYPE_OPTIONS = [
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'BEHAVIORAL', label: 'Behavioral' },
  { value: 'VETERINARY', label: 'Veterinary' },
];

// Badge colors per log type
export const LOG_TYPE_COLORS = {
  MEDICAL: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200',
  BEHAVIORAL: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
  VETERINARY: 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-200',
};

// Helper to format log type for display
export const formatLogType = (type) => {
  return type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : '';
};
