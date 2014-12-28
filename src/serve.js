var express = require('express')
var app = express();
var path = require('path')

app.set('port', (process.env.PORT || 5001))

app.use(express.static(path.resolve('static/')))

app.get('/', function(request, response) {
  response.sendFile(path.resolve('static/index.html'));
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

