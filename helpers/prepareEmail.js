// Prepare email for password reset
const emailData = (email, fullName, oneTimeCode) => {
    return {
      email,
      subject: 'Password Reset Email',
      html: `
        <h1>Hello, ${fullName}</h1>
        <p>Your One Time Code is <h3>${oneTimeCode}</h3> to reset your password</p>
        <small>This Code is valid for 3 minutes</small>
      `
    };
  };
  

  module.exports = { emailData }