(function() {
  var connect, path, resolve, server, use, _i, _len, _ref;

  resolve = require('path').resolve;

  server = (connect = require('connect'))();

  if (process.argv.length !== 3) {
    console.log("[dir]");
  } else {
    path = resolve(process.argv[2]);
    _ref = [
      connect.favicon(), connect.static(path, {
        maxAge: 1,
        hidden: true
      })
    ];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      use = _ref[_i];
      server.use(use);
    }
    server.listen(8080, function() {
      return console.log("'serving " + path + " on " + (server.address().port));
    });
  }

}).call(this);
