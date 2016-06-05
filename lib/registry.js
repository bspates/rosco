var _ = require('lodash');
var async = require('async');

module.exports = (function() {

  function Registry() {
    this.lookupTable = {};
    this.register({
      name: 'describe',
      method: (cb) => {
        cb(null, _.values(this.lookupTable));
      },
      description: 'Returns all currently available methods'
    });
  }

  Registry.prototype.freeze = function() {
    _.forEach(this.lookupTable, function(value) {
       Object.freeze(value);
    });
    this.lookupTable = Object.freeze(this.lookupTable);
    Object.freeze(this);
  };

  /**
   *  Find registered method by name
   * @param   string methodName
   * @returns object clone of method wrapper
   */
  Registry.prototype.lookup = function(methodName) {
    if(!_.has(this.lookupTable, methodName)) return false;

    return _.clone(this.lookupTable[methodName]);
  };

  /**
   * Insert method into lookupTable
   * @param string   methodName
   * @param function method
   * @param string   description
   */
  Registry.prototype._register = function(methodName, method, description) {
    this.lookupTable[methodName] = {
      run: method,
      // Set length here so that future partial param application will not
      // obfuscate the expected number of params
      length: method.length - 1, // Don't count callback
      name: methodName,
      description: description
    };
  };

  /**
   * Register a sequence of functions as a single method
   * @param string methodName
   * @param array  methods
   */
  Registry.prototype._registerSequence = function(methodName, methods) {
    if(methods.length === 0) {
      throw new Error('Method array must contain at least one method to be registered');
    }

    if(methods.length === 1) {
      return this._register(methodName, methods[0]);
    }

    var asyncMethods = _.map(methods, function(method) {
      if(!_.isFunction(method)) {
        throw new Error('Method must be a function');
      }
      return async.ensureAsync(method);
    });

    var firstMethodLength = methods[0].length - 1;
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
  };

  /**
   * Register a single methodDef
   * @param object methodDef  {name: string, method: function}
   */
  Registry.prototype._registerOne = function(methodDef) {
    var methodName = methodDef.name;
    var method = methodDef.method || methodDef.methods;

    if(!_.isString(methodName)) {
      throw new Error('Method name provided for registration must be a string');
    }

    if(_.isArray(method)) {
      this._registerSequence(methodName, method);
    } else if(_.isFunction(method)) {
      this._register(methodName, method, methodDef.description);
    } else {
      throw new Error('Method must be a function or an array of functions');
    }
  };

  /**
   * Register an array of methodDefs
   * @param array methodDefs
   */
  Registry.prototype._registerMany = function(methodDefs) {
    if(!_.isArray(methodDefs)) {
      throw new Error('Object must be an array of method definitions');
    }

    _.forEach(methodDefs, (methodDef) => {
      this._registerOne(methodDef);
    });
  };

  /**
   * Option parsing for different register invocations
   * - register('test', function(cb){cb();})
   * - register(function test(cb) {cb();})
   * - register({name: 'test', method: function(cb) {cb();}})
   * - register([{name: 'test', method: function(cb) {cb();}}, ...])
   */
  Registry.prototype.register = function(one, two) {
    if(_.isString(one) && _.isObject(two)) {
      this._registerOne({
        name: one,
        method: two
      });
    } else if(_.isFunction(one) && two == null) {
      if(_.isEmpty(one.name)) {
        throw new Error(
          'Registered method must be a named function or the' +
          'name parameter must be provided.'
        );
      }
      this._registerOne({
        name: one.name,
        method: one
      });
    } else if(_.isObject(one) && two == null) {
      if(_.isArray(one)) {
        this._registerMany(one);
      } else {
        this._registerOne(one);
      }
    } else {
      throw new Error('Invalid parameters supplied to register');
    }
  };

  return Registry;
})();
