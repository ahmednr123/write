var express = require('express');
var app = express();

var bodyParser = require('body-parser')
var session = require('express-session');

var router = require('./routes/routes.js');

var port = process.env.PORT || 8080;

//app.use(express.static('public', { maxAge: 86400000 }));
app.use(session({secret: 'root', saveUninitialized: true, resave: true}));
app.use(express.static('public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended:true
}))

app.set('view engine', 'pug');

router(app);

app.listen(port, function(){
	console.log("Welcome!");
});