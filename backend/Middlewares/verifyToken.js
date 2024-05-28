const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  // Get bearer token from headers of req
  const bearerToken = req.headers.authorization;
  // if bearer token is not available
  if (!bearerToken) {
    return res.send({
      message: "Unauthorized access! Please login to continue",
    });
  }
  // Extract token from bearer token
  const token = bearerToken.split(" ")[1];

  // Log the token for debugging purposes
  console.log("Token:", token);

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = verifyToken;
