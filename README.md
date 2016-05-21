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

**Why?**

RESTful APIs come in all different shapes and sizes today. The W3C has clearly
defined the uses of the different HTTP methods, but that does not mean people
use them at intended. It seems like every development team comes up with their own
standards for when/where to use PATCH vs PUT etc. These small vagaries lead to
wasted time for:
* developer ramp up on a new team
* arguments about which HTTP method should be used where
* learning a particular API's REST style

The hope of this project is to combine the best of both worlds from RESTful and
RPC. The main advantage of RESTful APIs is the lack of state between calls.
In contrast the problem with RPC is that the many of its protocols track state
between calls. Where RPC shines is the cognitive simplicity of its
model. You register methods that can be invoked across systems. The building
blocks of the server then becomes the functions available to be called. Much
simpler than the layers of routes, url parameters, query parameters, and request
bodies that have to be defined, parsed, and validated. In this space it seems
like we are constantly re-solving the same problems.  

The simplicity of calling a method on a remote server can remove the cognitive
and development overhead of our current RESTful APIs (sooo much boilerplate).
While having these method invocations follow REST's stateless model we remove
the major downside to RPC. RPC over HTTP then can provide an existing protocol
to follow when implementing this hybrid. The only omission being a reference id
for the job invoked.
