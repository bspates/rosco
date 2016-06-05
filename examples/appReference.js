var Rosco = require('../index.js');

var app = new Rosco();
app.use(function(req, res, next) {
  this.app.log('log from middleware');
  next();
});

app.register('testRef', function(payload, cb) {
  this.app.log('log from registered method');
  cb();
});

app.listen(3000);
