jwt = require("jsonwebtoken");

function signJwtToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function verifyJwtToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  signJwtToken,
  verifyJwtToken,
};
