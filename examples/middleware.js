var Rosco = require('../index.js');

var app = new Rosco();

app.use(function(req, res, next) {
  console.log('log from middleware');
  next();
});

app.register('test_middleware', function(payload, cb) {
  console.log('log from registered method');
  cb();
});

app.listen(3000);
