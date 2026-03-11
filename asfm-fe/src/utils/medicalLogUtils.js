/**
 * Format ISO date string to localized datetime string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or '—' if empty
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString();
};
