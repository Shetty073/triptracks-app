// Format: DD/MM/YYYY
export function formatDateToDDMMYYYY(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB');
}


// Format: DD-MM-YYYY HH:mm (24-hour)
export function formatDateToDDMMYYYYWithTime24(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
}

// Format: DD-MM-YYYY hh:mm AM/PM (12-hour)
export function formatDateToDDMMYYYYWithTime12(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', '');
}
