const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Name is must be given'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: [true, 'Email should be unique'],
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
      },
      message: 'Please enter a valid Email'
    }
  },
  phoneNumber: { type: String, required: [true, 'Phone number is must be given'] },
  password: {
    type: String,
    required: [true, 'Password must be given'],
    minlength: [8, 'Password can be minimum 8 characters'],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  oneTimeCode: { type: String, required: false },
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
    },
  },
},
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);