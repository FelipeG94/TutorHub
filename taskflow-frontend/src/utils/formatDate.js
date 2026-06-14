/**
 * Formats an ISO date string to Spanish readable format
 * Example: '2025-01-15T10:30:00Z' -> '15 ene 2025'
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(isoString) {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return formatter.format(date);
}

/**
 * Formats an ISO date string to relative time format
 * Example: '2025-01-15T10:30:00Z' -> 'hace 5 minutos'
 * @param {string} isoString - ISO date string
 * @returns {string} Relative time text
 */
export function formatRelative(isoString) {
  const dateTime = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = now - dateTime;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'hace unos segundos';
  } else if (diffMinutes < 60) {
    return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 30) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else {
    return formatDate(isoString);
  }
}

/**
 * Formats an ISO date string to full date and time format
 * Example: '2025-01-15T10:30:00Z' -> '15 ene 2025, 10:30 hs'
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date and time
 */
export function formatDateTime(isoString) {
  const date = new Date(isoString);
  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);
  return `${formattedDate}, ${formattedTime} hs`;
}
