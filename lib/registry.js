var _ = require('lodash');
var async = require('async');

module.exports = (function() {

  var lookupTable;

  function Registry(lookupTable) {
    this.lookupTable = lookupTable || {};
  }

  Registry.prototype.lookup = function(methodName) {
    if(!_.has(this.lookupTable, methodName)) return false;

    return this.lookupTable[methodName];
  };

  Registry.prototype._register = function(methodName, method) {
    this.lookupTable[methodName] = {
      run: method,
      // Set length here so that future partial param application will not
      // obfuscate the expected number of params
      length: method.length,
      name: methodName
    };
  };

  Registry.prototype._registerOne = function(methodName, methods) {
    if(!_.isString(methodName)) {
      throw new Error('Method name provided for registration must be a string');
    }

    if(_.isArray(methods)) {
      if(methods.length === 0) {
        throw new Error('Method array must contain at least one method to be registered');
      }

      if(methods.length === 1) {
        this.lookupTable[methodName] = methods[0];
        return;
      }

      var asyncMethods = _.map(methods, function(method) {
        if(!_.isFunction(method)) {
          throw new Error('Method must be a function');
        }
        return async.ensureAsync(method);
      });

      var firstMethodLength = methods[0].length;
      this._register(methodName, function() {
        var cb = _.last(arguments);
        var tmpMethods = _.clone(asyncMethods);
        tmpMethods[0] = _.bind(tmpMethods[0], this,
          // TODO: determine if this leaks argumnents
          _.slice(arguments, 0, arguments.length-1)
        );
        tmpMethods = _.map(tmpMethods, (method) => _.bind(method, this));
        async.waterfall(tmpMethods, cb);
      });

      // Reset param length to be that of first method
      this.lookupTable[methodName].length = firstMethodLength;

    } else if(_.isFunction(methods)) {
      this._register(methodName, methods);
    } else {
      throw new Error('Method must be a function or an array of functions');
    }
  };

  Registry.prototype._registerMany = function(methodDefs) {
    if(!_.isArray(methodDefs)) {
      throw new Error('Object must be an array of method definitions');
    }

    _.forEach(methodDefs, (methodDef) => {
      this._registerOne(methodDef.methodName, methodDef.method || methodDef.methods);
    });
  };

  Registry.prototype.register = function(one, two) {
    if(_.isString(one) && _.isObject(two)) {
      this._registerOne(one, two);
    } else if(_.isObject(one) && two == null) {
      this._registerMany(one);
    } else {
      throw new Error('Invalid parameters supplied to register');
    }
  };

  return Registry;
})();
