/**
 * Common validation functions for form fields
 */

// Regular expressions for validation
const PATTERNS = {
  // Allows letters, numbers, spaces, and basic punctuation
  ALPHANUMERIC: /^[a-zA-Z0-9\s.,!?-]*$/,
  // Standard email pattern
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Only numbers
  NUMBERS_ONLY: /^\d+$/,
  // Only letters and spaces
  TEXT_ONLY: /^[a-zA-Z\s]*$/,
  // URL pattern
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  // Phone number (basic)
  PHONE: /^\+?[\d\s-()]{10,}$/,
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates if a value is not empty
 */
export const required = (value: any, fieldName: string = 'Field'): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
};

/**
 * Validates if a string contains only alphanumeric characters and basic punctuation
 */
export const isAlphanumeric = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value) return { isValid: true };

  if (!PATTERNS.ALPHANUMERIC.test(value)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, numbers, and basic punctuation`,
    };
  }
  return { isValid: true };
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: true };

  if (!PATTERNS.EMAIL.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }
  return { isValid: true };
};

/**
 * Validates text-only input (letters and spaces)
 */
export const isTextOnly = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value) return { isValid: true };

  if (!PATTERNS.TEXT_ONLY.test(value)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters and spaces`,
    };
  }
  return { isValid: true };
};

/**
 * Validates minimum length
 */
export const minLength = (value: string, min: number, fieldName: string = 'Field'): ValidationResult => {
  if (!value) return { isValid: true };

  if (value.length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters long`,
    };
  }
  return { isValid: true };
};

/**
 * Validates maximum length
 */
export const maxLength = (value: string, max: number, fieldName: string = 'Field'): ValidationResult => {
  if (!value) return { isValid: true };

  if (value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${max} characters`,
    };
  }
  return { isValid: true };
};

/**
 * Validates if value matches a specific pattern
 */
export const matchPattern = (
  value: string,
  pattern: RegExp,
  errorMessage: string
): ValidationResult => {
  if (!value) return { isValid: true };

  if (!pattern.test(value)) {
    return {
      isValid: false,
      error: errorMessage,
    };
  }
  return { isValid: true };
};

/**
 * Combines multiple validations
 */
export const validateAll = (validations: ValidationResult[]): ValidationResult => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
};

// Example usage for form validation
export const validateForm = (values: Record<string, any>) => {
  const errors: Record<string, string> = {};

  // Example validation for a name field
  const nameValidation = validateAll([
    required(values.name, 'Name'),
    isTextOnly(values.name, 'Name'),
    maxLength(values.name, 50, 'Name')
  ]);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  // Example validation for an email field
  const emailValidation = validateAll([
    required(values.email, 'Email'),
    isValidEmail(values.email)
  ]);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 