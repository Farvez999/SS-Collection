var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var categoryRouter = require('./routes/categoryRouter');
var productRouter = require('./routes/productRouter');
var wishlistRouter = require('./routes/wishlistRouter');
var sliderRouter = require('./routes/sliderRouter');
var productFolderRouter = require('./routes/productFolderRouter');

var app = express();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/slider', sliderRouter);
app.use('/api/product-folder', productFolderRouter);


app.use('/public/image', express.static(__dirname + '/public/image'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
