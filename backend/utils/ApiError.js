class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation Failed", errors = []) {
    super(400, message);

    this.errors = errors;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource Not Found") {
    super(404, message);
  }
}

export default ApiError;