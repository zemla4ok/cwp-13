let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const config = require('./config.json')


let routes = require('./routes/index');
let fleets = require('./routes/fleets');


let db = require('./models')(Sequelize, config);
let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);





app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', 3000);

let server = app.listen(app.get('port'), function () {
    console.log('Started to set default values');
    require('./data')(db).then(() => {
        console.log(db.fleets);
        console.log('Db default values setted')
    });
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = db;