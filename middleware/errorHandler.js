const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');
const jwt = require('jsonwebtoken');

const errorHandler = (err, req, res, next) => {
  // Sequelize Validation Error
  if (err instanceof ValidationError) {
    const validationErrors = err.errors.map(error => error.message);
    return res.status(400).json({
      message: 'Validation error',
      errors: validationErrors
    });
  }

  // Sequelize Unique Constraint Error
  if (err instanceof UniqueConstraintError) {
    const uniqueErrors = err.errors.map(e => e.message);
    return res.status(400).json({
      message: 'Unique constraint error',
      errors: uniqueErrors
    });
  }

  // Sequelize Foreign Key Constraint Error
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: `Foreign key constraint error: ${err.message}`,
      details: `Invalid reference for field '${err.fields}'. Check that related records exist.`
    });
  }

  // JWT Errors: Invalid Token or Expired Token
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ message: 'Invalid token. Please provide a valid token.' });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ message: 'Token expired. Please log in again.' });
  }

  // General Unexpected Error
  console.error('Unexpected error:', err.message, err.stack);

  // Send more detailed error messages in development mode
  const response = {
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  res.status(err.status || 500).json(response);
};

module.exports = errorHandler;
