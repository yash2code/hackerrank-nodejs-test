var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var erase = require('./routes/erase');
var trades = require('./routes/trades');
var stocks = require('./routes/stocks');
const sqlite = require('sqlite3');

function createDB(app) {
  const DB = app.get('db');
  DB.run(
    `CREATE TABLE IF NOT EXISTS trades (
        id int primary key,
        type text,
        user_id int,
        user_name text,
        symbol text,
        shares int,
        price real,
        timestamp datetime
    );`,
    () => {
      DB.run(`CREATE INDEX IF NOT EXISTS unique_trade ON trades (id)`);
      DB.run(`CREATE INDEX IF NOT EXISTS symbol_index ON trades (symbol)`);
      DB.run(`CREATE INDEX IF NOT EXISTS price_index ON trades (price)`);
      DB.run(`CREATE INDEX IF NOT EXISTS time_index ON trades (timestamp)`);
      DB.run(`CREATE INDEX IF NOT EXISTS user_index ON trades (user_id)`);
      DB.run(`CREATE INDEX IF NOT EXISTS type_index ON trades (type)`);
    }
  );
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('db', new sqlite.Database(':memory:'));
createDB(app);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/trades', trades);
app.use('/erase', erase);
app.use('/stocks', stocks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
