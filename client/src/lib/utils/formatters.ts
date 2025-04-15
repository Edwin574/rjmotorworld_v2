/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats a number with commas as thousands separators
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US').format(number);
};

/**
 * Formats mileage with "miles" suffix
 */
export const formatMileage = (mileage: number): string => {
  return `${formatNumber(mileage)} miles`;
};

/**
 * Creates a car specs string (year, mileage, fuel, transmission)
 */
export const formatCarSpecs = (
  year: number, 
  mileage: number, 
  fuelType?: string, 
  transmission?: string
): string => {
  const parts = [year.toString()];
  
  if (mileage) {
    parts.push(`${formatNumber(mileage)} miles`);
  }
  
  if (fuelType) {
    parts.push(fuelType);
  }
  
  if (transmission) {
    parts.push(transmission);
  }
  
  return parts.join(' • ');
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Formats a date in a user-friendly way
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Generates a WhatsApp message URL with car details
 */
export const generateWhatsAppUrl = (phone: string, carTitle: string, carPrice: number): string => {
  const message = encodeURIComponent(
    `Hello, I'm interested in the ${carTitle} listed for ${formatCurrency(carPrice)}. Can you provide more information?`
  );
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`;
};
