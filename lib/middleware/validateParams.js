module.exports = function(request, response, next) {
  // TODO: Add actual param validations
  request.rosco.params = request.rosco.body.params;
  next();
};
