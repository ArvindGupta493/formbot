// utils/auth.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    userId: user._id,  // Ensure this is correct
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: "1y" });
};

module.exports = generateToken;
        