/**
 * Format a number as currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-IN', options);
}

/**
 * Get status display text with proper capitalization
 */
export function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Format phone number to readable format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Check if phone already has formatting
  if (phoneNumber.includes(' ') || phoneNumber.includes('-')) {
    return phoneNumber;
  }
  
  // Simple formatting for Indian numbers
  if (phoneNumber.length === 10) {
    return phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  
  return phoneNumber;
}

/**
 * Convert a date string to YYYY-MM-DD format
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}