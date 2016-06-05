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
  Rosco.prototype.register = function(one, two) {
    this.ref.registry.register(one, two);
  };

  Rosco.prototype.use = function(func) {
    this.ref.middleware.push(func);
  };

  Rosco.prototype.listen = function(port) {
    // Ensure registry does not change once server is turned on
    this.ref.freeze();

    var handler = (request, response) => {
      request.once('error', console.error);
      response.once('error', console.error);

      // Add Rosco sub object to request
      request.rosco = {
        registry: this.ref.registry,
        method: null,
        params: null,
        body: null
      };

      requestScope = {};
      this.ref.runMiddleware(requestScope, request, response, (err) => {
        errorResponse = (err) => {
          console.error(err);
          if(!response.finished) response.errors.internal(err.message || err);
        };

        if(err != null) return errorResponse(err);

        var runner = _.bind(request.rosco.method.run, requestScope);

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
