var Rosco = require('../index.js');

var app = new Rosco();
var registry = [
  {
    methodName: 'test_1',
    method: function(payload, cb) {
      console.log('test 1');
      cb(null, payload);
    }
  },
  {
    methodName: 'test_2',
    methods: [
      function(payload, cb) {
        console.log("test 2 func 1 " + payload);
        cb(null, payload);
      },
      function(payload, cb) {
        console.log("test 2 func 2 " + payload);
        cb(null, payload);
      }
    ]
  }
];

app.register(registry);

app.listen(3000);
