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

    this.errorHandler = function(err) {
      console.error(err);
    };
  }

  Ref.prototype.runMiddleware = function(scope, request, response, cb) {
    async.eachSeries(this.middleware, (middlewareFunc, cb) => {
      _.bind(middlewareFunc, scope)(request, response, cb);
    }, cb);
  };

  Ref.prototype.freeze = function() {
    this.registry.freeze();
  };

  return Ref;
})();
