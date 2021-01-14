var express  = require('express');
var app      = express();    // create express instance    
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
const request = require('request'); // Handle API Requests

var cors = require("cors");
app.use(cors());
                                       // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.get('/*', function(req,res) {
     request('http://localhost:9090' + req.url,
    (error, response, body) => {
        console.log(body)
        if (error) {
          return res.send(error);
        }
        res.send(body);
     })
});

// Express instance listens to the given port
// Express instance listens to the given port
const port = process.env.PORT || 4500;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

app.listen(port ,function(){
    console.log("Started on PORT ", port);
})
