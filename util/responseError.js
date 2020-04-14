const statusCodes = require('./statusCodes');
require('dotenv');

const isDev = process.env.NODE_ENV !== 'production';

const errorList = {
  bodyValidation: {
    status: statusCodes.BAD_REQUEST,
    code: 1,
    message: 'Body validation error',
  },
  queryValidation: {
    status: statusCodes.BAD_REQUEST,
    code: 2,
    message: 'Query validation error',
  },
  paramsValidation: {
    status: statusCodes.BAD_REQUEST,
    code: 3,
    message: 'Params validation error',
  },
  save: {
    status: statusCodes.SERVER_ERROR,
    code: 4,
    message: 'Error save',
  },
  create: {
    status: statusCodes.SERVER_ERROR,
    code: 5,
    message: 'Error create',
  },
  query: {
    status: statusCodes.SERVER_ERROR,
    code: 6,
    message: 'Error query',
  },
  deleteRecord: {
    status: statusCodes.SERVER_ERROR,
    code: 7,
    message: 'Error delete',
  },
  updateRecord: {
    status: statusCodes.SERVER_ERROR,
    code: 8,
    message: 'Error update',
  },
  timeout: {
    status: statusCodes.SERVER_ERROR,
    code: 9,
    message: 'Error timeout',
  },
  notModify: {
    status: statusCodes.SERVER_ERROR,
    code: 10,
    message: 'Not modify',
  },
  notFound: {
    status: statusCodes.SERVER_ERROR,
    code: 11,
    message: 'Not found',
  },
  undefinedError: {
    status: statusCodes.SERVER_ERROR,
    code: 12,
    message: 'Undefined error',
  },
  incorrectUserNameOrPassword: {
    status: statusCodes.BAD_REQUEST,
    code: 13,
    message: 'Incorrect userName or password',
  },
  unauthorized: {
    status: statusCodes.BAD_REQUEST,
    code: 14,
    message: 'Unauthorized',
  },
  userAlreadyCreated: {
    status: statusCodes.BAD_REQUEST,
    code: 15,
    message: 'User Already Created',
  },
  notEnoughRights: {
    status: statusCodes.BAD_REQUEST,
    code: 16,
    message: 'Not Enough Rights',
  },
};

function buildResponse({ code, message, status }, data) {
  return {
    status,
    body: {
      err: {
        code,
        message,
        data: isDev && data ? data : {},
      },
    },
  };
}

class ResponseError {
  bodyValidation(data = {}) {
    return buildResponse(errorList.bodyValidation, data);
  }

  queryValidation(data = {}) {
    return buildResponse(errorList.queryValidation, data);
  }

  paramsValidation(data = {}) {
    return buildResponse(errorList.paramsValidation, data);
  }

  save(data = {}) {
    return buildResponse(errorList.save, data);
  }

  create(data = {}) {
    return buildResponse(errorList.create, data);
  }

  query(data = {}) {
    return buildResponse(errorList.query, data);
  }

  delete(data = {}) {
    return buildResponse(errorList.deleteRecord, data);
  }

  update(data = {}) {
    return buildResponse(errorList.updateRecord, data);
  }

  timeout(data = {}) {
    return buildResponse(errorList.timeout, data);
  }

  notFound(data = {}) {
    return buildResponse(errorList.notFound, data);
  }

  notModify(data = {}) {
    return buildResponse(errorList.notModify, data);
  }

  undefinedError(data = {}) {
    return buildResponse(errorList.undefinedError, data);
  }

  incorrectUserNameOrPassword(data = {}) {
    return buildResponse(errorList.incorrectUserNameOrPassword, data);
  }

  unauthorized(data = {}) {
    return buildResponse(errorList.unauthorized, data);
  }

  userAlreadyCreated(data = {}) {
    return buildResponse(errorList.userAlreadyCreated, data);
  }

  notEnoughRights(data = {}) {
    return buildResponse(errorList.notEnoughRights, data);
  }
}

module.exports = new ResponseError();
