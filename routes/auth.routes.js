const {
  handleUserLogin,
  handleUserPasswordChange,
  handleUserUpdate,
} = require("../controllers/auth.controller");

express = require("express");
router = express.Router();

router.post("/login", handleUserLogin);
router.post("/change-password", handleUserPasswordChange);
router.patch("/user", handleUserUpdate);

module.exports = router;
