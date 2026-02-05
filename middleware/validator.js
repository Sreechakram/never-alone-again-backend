// middleware/validator.js
const { ValidationError, ValidationErrorItem } = require('sequelize');

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(normalized);
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8 && password.length <= 64;
};

/**
 * RETURNS an error instead of throwing
 */
const validateSignupInput = ({ email, password }) => {
  if (!isValidEmail(email)) {
    return new ValidationError('Validation error', [
      new ValidationErrorItem(
        'Invalid email format',
        'Validation error',
        'email',
        email
      ),
    ]);
  }

  if (!isValidPassword(password)) {
    return new ValidationError('Validation error', [
      new ValidationErrorItem(
        'Password must be between 8 and 64 characters',
        'Validation error',
        'password',
        password
      ),
    ]);
  }

  return null; // ✅ valid
};

module.exports = {
  validateSignupInput,
  isValidEmail,
  isValidPassword,
};
