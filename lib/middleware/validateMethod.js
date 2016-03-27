var _ = require('lodash');

module.exports = function(request, response, next) {
  var methodName = request.rosco.body.method;
  var method = request.rosco.registry.lookup(methodName);

  if(method === false) {
    var errMsg = 'Unregistered method requested: ' + methodName;
    response.errors.methodNotFound(errMsg);
    return next(new Error(errMsg));
  }

  if(!_.isFunction(method)) {
    var errMsg = 'Method ' + methodName + ' is unavailable';
    response.errors.methodNotFound(errMsg);
    return next(new Error(errMsg));
  }

  request.rosco.method = method;

  next();
}
