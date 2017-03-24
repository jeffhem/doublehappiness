/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'guest_list'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();
var favicon = require('serve-favicon');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for (var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                dbCredentials.url = vcapServices[vcapService][0].credentials.url;
            }
        }
    }
    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

app.get('/', routes.index);

app.get('/guest-rsvp-list', routes.guest);

app.post('/api/rsvp', (req, res) => {
  if (req.body && req.body !== '') {
    const guestData = req.body;
    const extraGuest = [];
    var dbEntry = {};
    var returnData = {};

    guestData.forEach((entry) => {
      if (entry.type === 'primary-guest') {
        const id = `${entry.guest_first_name}_${entry.guest_last_name}`.replace(/ /g, '_');
        dbEntry = {
          _id: id,
          attending: entry.attend,
          firstName: entry.guest_first_name,
          lastName: entry.guest_last_name,
          entree: entry.entree,
          kids: entry.kids,
        };
        returnData = {
          attendanding: entry.attend,
          firstName: entry.guest_first_name,
        };
      } else if (entry.type === 'guest'){
        delete entry.type;
        extraGuest.push(entry);
      } else {
        dbEntry.message = entry.msg;
      }
    });

    dbEntry.extraGuest = extraGuest;

    // save doc
    db.insert(dbEntry, function(err, doc) {
      if (err) {
        console.log(err);
        res.status(err.statusCode);
        res.send(req.body);
      } else {
        console.log('New doc created ..');
        res.status(200);
        res.type('application/json');
        res.send(returnData);
      }
      res.end();
    });
  }
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
