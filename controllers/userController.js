const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const response = require("../helpers/response");
const User = require("../models/User");
const { createJSONWebToken } = require('../helpers/jsonWebToken');
const { emailData } = require('../helpers/prepareEmail');
const emailWithNodemailer = require('../helpers/email');

//Sign up user
const signUp = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    console.log(req.body);

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: 'User already exists! Please login' });
    }

    // Generate OTC (One-Time Code)
    const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    // Create the user in the database
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      oneTimeCode,
    });

    // Prepare email for activate user
    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h1>Hello, ${user.fullName}</h1>
        <p>Your One Time Code is <h3>${oneTimeCode}</h3> to reset your password</p>
        <p>Please click on the following link to <a href='${process.env.CLIENT_URL}/api/user/activate'>activate your account</a></p>
        <small>This Code is valid for 3 minutes</small>
        `
    }

    // Send email
    try {
      emailWithNodemailer(emailData);
      res.status(201).json({ message: 'Thanks! Please check your E-mail to verify.' });
    } catch (emailError) {
      console.error('Failed to send verifiaction email', emailError);
    }

    // Set a timeout to update the oneTimeCode to null after 1 minute
    setTimeout(async () => {
      try {
        user.oneTimeCode = null;
        await user.save();
        console.log('oneTimeCode reset to null after 3 minute');
      } catch (error) {
        console.error('Error updating oneTimeCode:', error);
      }
    }, 180000); // 3 minute in milliseconds

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

//Sign in user
const signIn = async (req, res, next) => {
    try {
        // Get email and password from req.body
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json(response({ statusCode: 401, message: 'Authentication failed', status: "Failed" }));
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json(response({ statusCode: 401, message: 'Authentication failed', status: "Failed" }));
        }

        // Checking banned user
        // if (user.isBanned === "true") {
        //     return res.status(403).json(response({ statusCode: 403, message: 'User is banned', status: "Failed" }));
        // }

        const accessToken = createJSONWebToken({ _id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, '24h');
        console.log(accessToken);

        //Success response
        res.status(200).json(response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: user, token: accessToken , type: "user" }));




    } catch (error) {
        next(createError(response({ statusCode: 500, message: 'Internel server error', status: "Failed"})));
    }
};

//Process forgot password
const processForgetPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      // Check if the user already exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json(response({ statusCode: 404, message: "User not found", status: "Failed", type: 'user' }));
      }
  
      // Generate OTC (One-Time Code)
      const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  
      // Store the OTC and its expiration time in the database
      user.oneTimeCode = oneTimeCode;
      await user.save();
  
      // Send email
      try {
        await emailWithNodemailer(emailData(email, user.fullName, oneTimeCode));
      } catch (emailError) {
        console.error('Failed to send verification email', emailError);
      }
  
      // Set a timeout to update the oneTimeCode to null after 1 minute
      setTimeout(async () => {
        try {
          user.oneTimeCode = null;
          await user.save();
          console.log('oneTimeCode reset to null after 3 minute');
        } catch (error) {
          console.error('Error updating oneTimeCode:', error);
        }
      }, 180000); // 3 minute in milliseconds
  
      res.status(201).json(response({ message: 'Thanks! Please check your email to reset password', status: "OK", statusCode: 200 }));
    } catch (error) {
      res.status(500).json(response({ message: 'Error processing forget password', statusCode: 500, status: "Failed" }));
    }
};

//verify one time code
const verifyOneTimeCode = async (req, res) => {
    try {
      const requestType = !req.query.requestType ? 'resetPassword' : req.query.requestType;
      const { oneTimeCode, email } = req.body;
      console.log(req.body.oneTimeCode);
      console.log(email);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json(response({ message: 'User does not exist', status: "Failed", statusCode: 404 }));
      } else if (user.oneTimeCode === oneTimeCode) {
        if (requestType === 'resetPassword') {
          user.oneTimeCode = 'verified';
          await user.save();
          res.status(200).json(response({ message: 'One Time Code verified successfully', type: "reset-forget password", status: "OK", statusCode: 200, data: user }));
        }
        else if (requestType === 'verifyEmail' && user.oneTimeCode !== null && user.emailVerified === false) {
          console.log('email verify---------------->', user)
          user.emailVerified = true;
          user.oneTimeCode = null;
          await user.save();
          res.status(200).json(response({ message: 'Email verified successfully', status: "OK", type: "email verification", statusCode: 200, data: user }));
        }
        else {
          res.status(409).json(response({ message: 'Request type not defined properly', status: "Error", statusCode: 409 }));
        }
      }
      else if (user.oneTimeCode === null) {
        res.status(410).json(response({ message: 'One Time Code has expired', status: "failed", statusCode: 410 }));
      }
      else {
        res.status(400).json(response({ message: 'Invalid OTC', status: "OK", statusCode: 200 }));
      }
    } catch (error) {
      res.status(500).json(response({ message: 'Error verifying OTC', status: "failed", statusCode: 500 }));
    }
};

//Update password without login
const updatePassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json(response({ message: 'User does not exist', status: "Failed", statusCode: 404 }));
      } else if (user.oneTimeCode === 'verified') {
        user.password = password;
        user.oneTimeCode = null;
        await user.save();
        res.status(200).json(response({ message: 'Password updated successfully', status: "OK", statusCode: 200 }));
      }
      else {
        res.status(200).json(response({ message: 'Something went wrong, try forget password again', status: "Failed", statusCode: 400 }));
      }
    } catch (error) {
      res.status(500).json(response({ message: 'Error updating password', status: "Failed", statusCode: 500 }));
    }
  };

module.exports = {signUp, signIn, processForgetPassword, verifyOneTimeCode, updatePassword};