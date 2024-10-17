function ConflictError(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function NotFoundError(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}

function ContentTypeMismatchError(message) {
  const error = new Error(message);
  error.status = 415;
  return error;
}

function UnauthorizedError(message) {
  const error = new Error(message);
  error.status = 401;
  return error;
}

export { ConflictError, NotFoundError, ContentTypeMismatchError, UnauthorizedError };