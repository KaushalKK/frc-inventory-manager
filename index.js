"use strict";

//libs
let http = require('http');
let morgan = require('morgan');
let express = require('express');
let bodyParser = require('body-parser');

let fs = require('fs');
let passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

let config = require('./config.js')();
let routes = require('./routes/index')(config);

//server config
let app = express();
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//set up passport
app.use(passport.initialize());

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = fs.readFileSync('keys/rsakey.pem');
opts.issuer = "canfrc";

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, jwt_payload);
}));

app.use('/', routes);
app.use(express.static('public'));

http.createServer(app).listen(app.get('port'), () => {
    console.log('FRC Inventory server listening on port ' + app.get('port'));
});