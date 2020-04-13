const CustomError = require('../util/customError');
const responseError = require('../util/responseError');
const { getAllMethodsClass } = require('../util/getAllFuncs');

const errorMessages = {};

{
  const wrappedErrors = [];

  getAllMethodsClass(responseError).forEach((methodName) => {
    try {
      wrappedErrors.push(methodName);
      errorMessages[JSON.parse(new CustomError()[methodName]().message).type] = responseError[methodName];
    } catch (e) {
      console.warn('Error wrap method - ', methodName);
    }
  });
  console.log('\nSuccess wrapped errors: ');
  wrappedErrors.forEach((methodName) => console.log(methodName));
  console.log('\n');
}

function printUndefined(res, err) {
  const undefinedError = responseError.undefinedError({ err: err.toString() });
  res.status(undefinedError.status).json(undefinedError.body);
}

// eslint-disable-next-line
async function checkError(err, res) {
  if (err.name === 'CustomError') {
    try {
      const errMessage = JSON.parse(err.message);

      if (errMessage && errMessage.type && errorMessages[errMessage.type]) {
        const response = errorMessages[errMessage.type](errMessage.data);
        res.status(response.status).json(response.body);
        return;
      }
      return printUndefined(res, err);
    } catch (e) {
      return printUndefined(res, err);
    }
  }
  printUndefined(res, err);
}

const wrapAsyncError = (fn) => (req, res, next) => {
  fn(req, res, next).catch((e) => checkError(e, res));
};

module.exports = wrapAsyncError;
