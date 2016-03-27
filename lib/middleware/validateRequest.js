module.exports = function(request, response, next) {
  if(request.method !== 'POST') {
    var errMsg = 'Only the POST http method is allowed';
    response.errors.badRequest(errMsg);
    return next(new Error(errMsg));
  }

  if(request.headers['content-type'] !== 'application/json') {
    var errMsg = 'Content-Type must be "application/json"';
    response.errors.badRequest(errMsg);
    return next(new Error(errMsg));
  }

  var body = null;
  request.on('data', function(chunk) {
    if(body == null) {
      body = new Buffer(chunk);
    } else {
      body = Buffer.concat(body, chunk);
    }
  }).on('end', function() {
    try {
      var requestObj = JSON.parse(body);
    } catch(err) {
      response.errors.parse(err.message);
      return next(err);
    }

    if(requestObj.method == null) {
      var errMsg = 'Request must specify method in payload.'
      response.errors.badRequest(errMsg);
      return next(new Error(errMsg));
    }

    request.rosco.body = requestObj;
    next();
  });
};
