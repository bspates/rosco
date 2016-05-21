Rosco
-----

**Installation**:

`npm install rosco`

**Simple Echo Server Example**
```js
var Rosco = require('rosco');

// Create server instance
var app = new Rosco();

// Register a single method for RPC calls
app.register('echo', function(payload, callback) {
  this.logger('executing echo');
  callback(null, payload);
});
```
