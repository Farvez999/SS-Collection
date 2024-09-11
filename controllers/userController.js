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

    // Create the user in the database
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
    });

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully!' });

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

const getProfile = async (req, res, next) => {
  try {
      // Extract the user ID from the request (assuming the user is already authenticated via JWT)
      const userId = req.user;

      // Find the user by ID
      const user = await User.findById(userId).select('-password'); // Exclude the password field from the response

      if (!user) {
          return res.status(404).json(response({ statusCode: 404, message: 'User not found', status: "Failed" }));
      }

      // Respond with the user profile data
      res.status(200).json(response({ statusCode: 200, message: 'User profile fetched successfully', status: "OK", data: user }));

  } catch (error) {
      next(createError(response({ statusCode: 500, message: 'Internal server error', status: "Failed"})));
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


  // With Image
  // const updateUser = async (req, res) => {
  //   try {
  //     const { fullName, phoneNumber } = req.body;
  //     const userId = req.user; // Assuming you're getting the user ID from a decoded JWT token
  
  //     // Find the user by ID
  //     let user = await User.findById(userId);
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     // Update user information
  //     if (fullName) user.fullName = fullName;
  //     // if (email) user.email = email;
  //     if (phoneNumber) user.phoneNumber = phoneNumber;
  
  //     // If there's an image file in the request
  //     if (req.file) {
  //       const imagePath = req.file.path; // Assuming you are using multer or similar middleware for file uploads
  //       user.profileImage = imagePath;
        
  //       // Example for Cloudinary image upload
  //       // const result = await cloudinary.uploader.upload(imagePath, {
  //       //   folder: 'user_profiles', // This is the folder in Cloudinary where images will be stored
  //       // });
  
  //       // Update user's profile image with the Cloudinary secure URL
  //       // user.profileImage = result.secure_url;
  //     }
  
  //     // Save the updated user information
  //     await user.save();
  
  //     // Return success response with updated user data
  //     res.status(200).json({ message: 'User updated successfully', user });
  
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //     res.status(500).json({ message: 'Error updating user', error });
  //   }
  // };

  // Without Image 
  const updateUser = async (req, res) => {
    try {
      const { fullName, phoneNumber } = req.body;
      const userId = req.user; // Assuming you're getting the user ID from a decoded JWT token
  
      // Find the user by ID
      let user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user information
      if (fullName) user.fullName = fullName;
      if (phoneNumber) user.phoneNumber = phoneNumber;
  
      // Save the updated user information
      await user.save();
  
      // Return success response with updated user data
      res.status(200).json({ message: 'User updated successfully', user });
  
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user', error });
    }
  };


  
  

module.exports = {signUp, signIn,getProfile, processForgetPassword, verifyOneTimeCode, updatePassword, updateUser};