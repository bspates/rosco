var _ = require('lodash');

const JSON_CONTENT_TYPE = {'Content-Type': 'application/json'};

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

    response.writeHead(200, JSON_CONTENT_TYPE);
    response.write(JSON.stringify(packagedResult));
    response.end();
  },
  error: function(httpCode, rpcCode, response, msg) {
    response.writeHead(httpCode, JSON_CONTENT_TYPE);
    response.write(JSON.stringify({
      "error": {
        "code": rpcCode,
        "message": msg
      }
    }));
    response.end();
  }
};
