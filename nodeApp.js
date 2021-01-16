var express  = require('express');
var app      = express();    // create express instance    
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
const request = require('request'); // Handle API Requests
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json());                                    
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded

var multer = require('multer');
var forms = multer();
// apply them
app.use(forms.array()); 


app.get('/*', function(req,res) {
    request('https://wikisearcher-app.herokuapp.com' + req.url,
   (error, response, body) => {
       console.log(body)
       if (error) {
         return res.send(error);
       }
       res.send(body);
    })
});

app.post('/*', (req, res) => {
    x = req.body;
    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://wikisearcher-app.herokuapp.com' + req.url,
        json: true,
        formData: {
            doc: {
                value: (x.doc),
                options : {
                    contentType: 'application/json'
                } 
            },
            maxScore: x.maxScore
        }
        
      },
        (error, response, body) => {
          console.log('Got response', body)
          if (error) {
            return res.send(error);
          }
          res.send(body);
        }
      )
  })
const port = process.env.PORT || 4500;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    // next();
  });

app.listen(port ,function(){
    console.log("Started on PORT ", port);
})
