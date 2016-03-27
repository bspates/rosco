var Rosco = require('../index.js');

var app = new Rosco();
app.use(function(req, res, next) {
  this.logger('log from middleware');
  next();
});

app.register('testRef', function(payload, cb) {
  this.logger('log from registered method');
  cb();
});

app.listen(3000);
