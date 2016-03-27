var _ = require('lodash');
var responseHandler = require('../utils/responseHandler');

// http code, and rpc code
var errors = {
  badRequest: [400, -32600],
  parse: [500, -32700],
  methodNotFound: [404, -32601],
  invalidParams: [500, -32602],
  internal: [500, -32603],
  app: [500, -32500]
};

module.exports = function(request, response, next) {
  response.errors = {};
  _.forEach(errors, function(codes, error) {
    response.errors[error] = _.partial(responseHandler.error, ...codes, response);
  });

  next();
};
