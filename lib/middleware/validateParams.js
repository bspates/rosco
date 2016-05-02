var _ = require('lodash');

module.exports = function(request, response, next) {
  var params = request.rosco.params = request.rosco.body.params;

  switch(request.rosco.method.length) {
    case 0: // if no params expected (in js spirit) ignore params
      break;
    case 1: // named params (just one param that is an object)
      if (_.isPlainObject(params)) {
        request.rosco.method.run = _.partial(request.rosco.method.run, params);
        break;
      }
    default: // More than one param -> ordered params or bad params
      if (_.isArray(params) && params.length > 0) {
        if (params.length !== request.rosco.method.length) {
          var msg = 'Incorrect number of params supplied for method: ' + request.rosco.method.name;
          response.errors.invalidParams(msg);
          return next(new Error(msg));
        }

        // Partially apply params to method
        request.rosco.method.run = _.partial(request.rosco.method.run, ...params);
      } else {
        var msg = 'Params must be an in ordered array of params or a plain object';
        response.errors.invalidParams(msg);
        return next(new Error(msg));
      }
  }

  next();
};
