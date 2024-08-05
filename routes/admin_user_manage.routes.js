const {
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleViewAllUsers,
  handleResetPassword,
} = require("../controllers/admin_user_manage.controller");

express = require("express");
router = express.Router();

router.post("/", handleCreateUser);
router.get("/", handleViewAllUsers);
router.delete("/:userId", handleDeleteUser);
router.patch("/:userId", handleUpdateUser);
router.patch("/reset-password/:userId", handleResetPassword);

module.exports = router;
