var Rosco = require('../index.js');

var app = new Rosco();
app.register('test', function(one, two, three, cb) {
  this.app.log(one);
  this.app.log(two);
  this.app.log(three);
  cb();
});

app.listen(3000);
