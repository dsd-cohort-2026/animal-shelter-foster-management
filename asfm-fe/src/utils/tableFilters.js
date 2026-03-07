/**
 * Case-insensitive text search filter.
 * Filters an array of items by checking if the value at `fieldKey`
 * contains the search term.
 *
 * @param {Array} data - The array of items to filter.
 * @param {string} searchTerm - The text to search for.
 * @param {string} fieldKey - The property name to search against.
 * @returns {Array} Filtered array.
 */
export function filterBySearch(data, searchTerm, fieldKey) {
  if (!searchTerm) return data;
  const term = searchTerm.toLowerCase();
  return data.filter((item) => {
    const value = item[fieldKey];
    return value != null && String(value).toLowerCase().includes(term);
  });
}

/**
 * Exact-match dropdown filter.
 * Filters an array of items by checking if the value at `fieldKey`
 * matches the selected filter value. A value of 'all' bypasses the filter.
 *
 * @param {Array} data - The array of items to filter.
 * @param {string} filterValue - The selected filter value (or 'all' to skip).
 * @param {string} fieldKey - The property name to match against.
 * @returns {Array} Filtered array.
 */
export function filterByField(data, filterValue, fieldKey) {
  if (!filterValue || filterValue === 'all') return data;
  return data.filter((item) => item[fieldKey] === filterValue);
}
