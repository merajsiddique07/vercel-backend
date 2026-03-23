class ExpressError extends Error {
  ExpressError(status, message) {
    this.status = status;
    this.message = message;
  }
}

export default ExpressError;
