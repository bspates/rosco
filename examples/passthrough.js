var Rosco = require('../index.js');

var app = new Rosco();
app.register('test_passthrough', function(payload, cb) {
  console.log(payload);
  cb(null, payload);
});

app.listen(3000);
