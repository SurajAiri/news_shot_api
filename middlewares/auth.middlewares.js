const { verifyJwtToken } = require("../services/auth.services");

function checkForAuthorization(req, res, next) {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    req.user = null;
  } else {
    try {
      req.user = verifyJwtToken(token.split("Bearer ")[1]);
    } catch (error) {
      //   console.log("Authorization: ", error);
      req.user = null;
    }
  }

  next();
}

function restrictUserPermission(roles = ["summarizer", "verifier", "admin"]) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.sendResponse(403, "Permission denied");
    }
    next();
  };
}

module.exports = { checkForAuthorization, restrictUserPermission };
