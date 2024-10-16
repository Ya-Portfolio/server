class ApiResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = `${statusCode < 400 ? "Success" : "Failure"}: ${message}`;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
