var Rosco = require('../index.js');

var app = new Rosco();
app.register('test', function(one, two, three, cb) {
  this.logger(one);
  this.logger(two);
  this.logger(three);
  cb();
});

app.listen(3000);
