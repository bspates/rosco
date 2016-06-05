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

    // Functions bound to the "this" reference in the invoked methods
    // NOTE: Not to be used as a global data store
    this.public = {
      app: {
        error: function(err) { // default error handler
          console.error(err);
        },
        log: function(msg) { // default logger
          console.log(msg);
        }
      },
      request: {}
    };
  }

  Ref.prototype.runMiddleware = function(request, response, cb) {
    async.eachSeries(this.middleware, (middlewareFunc, cb) => {
      _.bind(middlewareFunc, this.public)(request, response, cb);
    }, cb);
  };

  Ref.prototype.setPubFunc = function(field, func) {
    if(func == null) {
      return this.public.app[field];
    } else if(!_.isFunction(func)) {
      throw new Error(field + ' provided must be a function');
    } else {
      return this.public.app[field] = func;
    }
  };

  Ref.prototype.freeze = function() {
    Object.freeze(this.public.app);
    this.public = Object.seal(this.public);
    this.registry.freeze();
  };

  return Ref;
})();
