var express = require('express');
var app = express();

app.use(express.static(__dirname + '/ui')); 

var portNumber = 1234;
var server = app.listen(process.env.PORT || portNumber,function(){
  console.log("We have started our server on port! "+portNumber);
});
app.get('/endpoints/getCountryInfo', function(request,response){
  response.sendFile(__dirname + '/countryInfoJSON.json');
});
app.get('*', function(req, res) {
  res.sendfile('./ui/views/index.html');
});