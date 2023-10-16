const { STATUS_UNAUTHORIZED } = require('../constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
