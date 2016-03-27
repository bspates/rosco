var Rosco = require('../index.js');

var app = new Rosco();
var registry = [
  {
    methodName: 'test',
    method: function(payload, cb) {
      console.log(payload);
      cb(null, payload);
    }
  },
  {
    methodName: 'test2',
    methods: [
      function(payload, cb) {
        console.log("func 1 " + payload);
        cb(null, payload);
      },
      function(payload, cb) {
        console.log("func 2 " + payload);
        cb(null, payload);
      }
    ]
  }
];

app.register(registry);

app.listen(3000);
