var Rosco = require('../index.js');

var app = new Rosco();
var registry = [
  {
    methodName: 'test',
    method: function(payload, cb) {
      this.logger(payload);
      cb(null, payload);
    }
  },
  {
    methodName: 'test2',
    methods: [
      function(payload, cb) {
        this.logger("func 1 " + payload);
        cb(null, payload);
      },
      function(payload, cb) {
        this.logger("func 2 " + payload);
        cb(null, payload);
      }
    ]
  }
];

app.register(registry);

app.listen(3000);
