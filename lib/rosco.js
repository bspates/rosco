var http = require('http');
var _ = require('lodash');
var async = require('async');

var responseHandler = require('./utils/responseHandler');
var Registry = require('./registry');
var Ref =  require('./ref');

/*
 * Rosco API
 * All calls to library are routed through the interface of this "class"
 */
module.exports = (function() {

  var ref;
  function Rosco() {
    // Internal shared state reference
    this.ref = new Ref(new Registry());
  }

  /*
   *  API Methods
   */
  Rosco.prototype.errorHandler = function(cb) {
    return this.ref.setPubFunc('errorHandler', cb);
  };

  Rosco.prototype.logger = function(logger) {
    return this.ref.setPubFunc('logger', logger);
  };

  Rosco.prototype.register = function(one, two) {
    this.ref.registry.register(one, two);
  };

  Rosco.prototype.use = function(func) {
    this.ref.middleware.push(func);
  };

  Rosco.prototype.singleton = function(name, method) {
    this.ref.setPubFunc(name, _.memoize(method));
  };

  Rosco.prototype.listen = function(port) {
    // Ensure registry does not change once server is turned on
    this.ref.freeze();

    var handler = (request, response) => {
      request.once('error', this.ref.public.app.error);
      response.once('error', this.ref.public.app.error);

      // Add Rosco sub object to request
      request.rosco = {
        registry: this.ref.registry,
        method: null,
        params: null,
        body: null
      };

      this.ref.runMiddleware(request, response, (err) => {
        errorResponse = (err) => {
          this.ref.public.app.error(err);
          if(!response.finished) response.errors.internal(err.message || err);
        };

        if(err != null) return errorResponse(err);

        var runner = _.bind(request.rosco.method.run, this.ref.public);

        runner((err, result) => {
          if(err != null) return errorResponse(err);

          responseHandler.success(response, result);
        });
      });
    };
    http.createServer(handler).listen(port);
  };

  return Rosco;
})();
