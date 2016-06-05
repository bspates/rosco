var Rosco = require('../index.js');

var app = new Rosco();
app.register('test_param_order', function(one, two, three, cb) {
  console.log(one);
  console.log(two);
  console.log(three);
  cb();
});

app.listen(3000);
