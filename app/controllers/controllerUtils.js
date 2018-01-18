'use strict';

const ok = function (docs, res, next) {
  res.status(200).json(docs);
  next();
};

const generateError = function (statusCode, errorMessage) {
  const err = {
    status: statusCode,
    error: (errorMessage.message ? errorMessage.message : errorMessage)
  };
  return err;
};

const returnDocs = function (docs, res, next) {
  return ok(docs, res, next);
};

const returnIfNoParam = function (paramName, param, next) {
  if (!param) return next(generateError(400, 'Parameter ' + paramName + ' must be provided'));
};

module.exports = {
  returnDocs: returnDocs,
  returnIfNoParam: returnIfNoParam,
  generateError: generateError
};