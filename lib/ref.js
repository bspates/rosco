var _ = require('lodash');
var async = require('async');

module.exports = (function() {

  function Ref(registry) {
    this.registry = registry;

    // List (in-order of invocation) of built in middlware
    this.middleware =  [
      require('./middleware/errors'),
      require('./middleware/validateRequest'),
      require('./middleware/validateMethod'),
      require('./middleware/validateParams')
    ];

    this.public = {
      errorHandler: function(err) { // default error handler
        console.error(err);
      },
      logger: function(msg) { // default logger
        console.log(msg);
      }
    };
  }

  Ref.prototype.runMiddleware = function(request, response, cb) {
    async.eachSeries(this.middleware, (middlewareFunc, cb) => {
      _.bind(middlewareFunc, this.public)(request, response, cb);
    }, cb);
  };

  Ref.prototype.pubFuncSetter = function(field, func) {
    if(func == null) {
      return this.public[field];
    } else if(!_.isFunction(func)) {
      throw new Error(field + ' provided must be a function');
    } else {
      return this.public[field] = func;
    }
  };

  return Ref;
})();
