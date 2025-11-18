export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const MIN_LENGTH = 8;

export function validatePassword(password: string): PasswordValidation {
  const criteria = {
    length: password.length >= MIN_LENGTH,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const errors: string[] = [];
  if (!criteria.length) errors.push(`Mínimo de ${MIN_LENGTH} caracteres.`);
  if (!criteria.uppercase) errors.push("Ao menos 1 letra maiúscula.");
  if (!criteria.lowercase) errors.push("Ao menos 1 letra minúscula.");
  if (!criteria.number) errors.push("Ao menos 1 número.");
  if (!criteria.special) errors.push("Ao menos 1 caractere especial (!@#$%^&*). ");

  return {
    isValid: errors.length === 0,
    errors,
    criteria,
  };
}
