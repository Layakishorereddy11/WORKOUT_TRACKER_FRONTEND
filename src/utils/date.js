/**
 * Safely parses a "YYYY-MM-DD" string into a Date object
 * that represents the given day in the user's local timezone,
 * avoiding common off-by-one errors.
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @returns {Date} A Date object.
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  // Splitting the string and creating a date from its parts treats it as local time.
  const parts = dateString.split('-').map(part => parseInt(part, 10));
  // Note: The month argument is 0-indexed (0=January, 1=February, etc.)
  return new Date(parts[0], parts[1] - 1, parts[2]);
}; 