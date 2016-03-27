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
    return this.ref.funcSetter('errorHandler', cb);
  };

  Rosco.prototype.logger = function(logger) {
    return this.ref.pubFuncSetter('logger', logger);
  };

  Rosco.prototype.register = function(one, two) {
    this.ref.registry.register(one, two);
  };

  Rosco.prototype.use = function(func) {
    this.ref.middleware.push(func);
  };

  Rosco.prototype.listen = function(port) {
    var handler = (request, response) => {
      request.on('error', this.ref.public.errorHandler);
      response.on('error', this.ref.public.errorHandler);

      // Add Rosco sub object to request
      request.rosco = {
         // Ensure registry dosen't change during request
        registry: new Registry(this.ref.registry.lookupTable),
        method: null,
        params: null,
        body: null
      };

      this.ref.runMiddleware(request, response, (err) => {
        if(err != null) {
          return this.ref.public.errorHandler(err);
        }

        var params = request.rosco.params;
        var method = _.bind(request.rosco.method, this.ref.public);

        method(params, function(err, result) {
          if(err != null) {
            return this.ref.public.errorHandler(err);
          }

          return responseHandler.success(response, result);
        });
      });
    };
    http.createServer(handler).listen(port);
  };

  return Rosco;
})();
