function getError(type, str) {
  const obj = { type };
  if (str) obj.data = { details: [str] };
  return new CustomError(JSON.stringify(obj));
}

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  create(str) {
    return getError('error create', str);
  }

  query(str) {
    return getError('error query', str);
  }

  delete(str) {
    return getError('error delete', str);
  }

  save(str) {
    return getError('error save', str);
  }

  update(str) {
    return getError('error update', str);
  }

  timeout(str) {
    return getError('error timeout', str);
  }

  notModify(str) {
    return getError('not modify', str);
  }

  notFound(str) {
    return getError('not found', str);
  }

  incorrectUserNameOrPassword(str) {
    return getError('incorrect user name or password', str);
  }

  unauthorized(str) {
    return getError('unauthorized', str);
  }

  userAlreadyCreated(str) {
    return getError('user already created', str);
  }

  notEnoughRights(str) {
    return getError('not enough rights', str);
  }

  postMessage(str) {
    return getError('post message', str);
  }
}

module.exports = CustomError;
