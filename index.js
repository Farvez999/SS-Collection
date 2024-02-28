let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/userRouter');
let categoryRouter = require('./routes/categoryRouter');
let productRouter = require('./routes/productRouter');
let wishlistRouter = require('./routes/wishlistRouter');
let sliderRouter = require('./routes/sliderRouter');
let productFolderRouter = require('./routes/productFolderRouter');

let app = express();
const PORT = process.env.PORT || 3000
// Connect to the MongoDB database

const main = async () => {
  try {
    await mongoose.connect('mongodb+srv://ssCollectionDBUser:7cdcJ0g7J5vuSrsc@cluster0.mordayw.mongodb.net/ss_collection?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define routes or any other setup here

    // app.listen(PORT, () => {
    //   console.log(`Server is listening on port ${PORT}`);
    // });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

main();


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

app.use(express.static('public'));
// app.use('/public/image', express.static(__dirname + '/public/image'))

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

app.listen(3005, () => {
  console.log(`Server started on port 3005`);
});

// '192.168.10.14'

module.exports = app;
