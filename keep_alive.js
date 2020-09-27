var http = require("http");

http.createServer(function (req, res){
  res.write("çalışıyor.");
  res.end();
}
).listen(8080);