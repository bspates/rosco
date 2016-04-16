var _ = require('lodash');

module.exports = function(request, response, next) {
  var params = request.rosco.params = request.rosco.body.params;

  //if falsey no param provided
  if (_.isEmpty(params)) return next();

  if (!_.isObject(params)) {
    return next(new Error('Invalid params: ' + params));
  }

  // Partially apply params to method
  if (_.isArray(params) && params.length > 0) { // ordered params
    if (params.length !== request.rosco.method.length) {
      var msg = 'Incorrect number of params supplied for method: ' + request.rosco.method.name;
      response.errors.invalidParams(msg);
      return next(new Error(msg));
    }
    request.rosco.method.run = _.partial(request.rosco.method.run, ...params);
  } else if (_.isPlainObject(params)){ // named params (just one param that is an object)
    request.rosco.method.run = _.partial(request.rosco.method.run, params);
  } else {
    var msg = 'Params must be an in ordered array of params or a plain object';
    response.errors.invalidParams(msg);
    return next(new Error(msg));
  }

  next();
};
