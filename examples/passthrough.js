var Rosco = require('../index.js');

var app = new Rosco();
app.register('test', function(payload, cb) {
  this.app.log(payload);
  cb(null, payload);
});

app.listen(3000);
