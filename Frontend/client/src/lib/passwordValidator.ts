export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export const passwordRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChar: true,
};

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < passwordRules.minLength) {
    errors.push(`Password must be at least ${passwordRules.minLength} characters long`);
  }

  if (passwordRules.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (passwordRules.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (passwordRules.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (passwordRules.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getPasswordStrength(password: string): "weak" | "fair" | "good" | "strong" {
  let strength = 0;

  if (password.length >= passwordRules.minLength) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  if (strength <= 1) return "weak";
  if (strength <= 2) return "fair";
  if (strength <= 3) return "good";
  return "strong";
}
