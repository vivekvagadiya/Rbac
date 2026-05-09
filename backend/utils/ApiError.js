// backend/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation Failed", errors = []) {
    super(message, 400, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}

export default ApiError;