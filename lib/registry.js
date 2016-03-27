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

      this.lookupTable[methodName] = function(payload, cb) {
        var first = _.partial(asyncMethods[0], payload);
        var methodList = _.concat(first, _.slice(asyncMethods, 1));
        async.waterfall(methodList, cb);
      };

    } else if(_.isFunction(methods)) {
      this.lookupTable[methodName] = methods;
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
