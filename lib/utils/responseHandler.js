var _ = require('lodash');

module.exports = {
  success: function(response, result) {
    var packagedResult;
    if(result == null) {
      packagedResult = {
        "result": null
      };
    } else if(_.isPlainObject(result)) {
      packagedResult = {
        "result": result
      };
    } else {
      packagedResult = {result};
    }

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(packagedResult));
    response.end();
  },
  error: function(httpCode, rpcCode, response, msg) {
    response.writeHead(httpCode, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({
      "error": {
        "code": rpcCode,
        "message": msg
      }
    }));
    response.end();
  }
};
