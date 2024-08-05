const user = require("../models/user.model");

// admin => create user, update user, delete user, view all users, reset password (auto-generate password)

async function handleCreateUser(req, res) {
  if (req.user?.role !== "admin") return res.sendResponse(403, "Unauthorized");

  const userInput = req.body;
  // validate if all required information is provided
  if (
    !userInput.name ||
    !userInput.email ||
    !userInput.role ||
    !userInput.password
  )
    return res.sendResponse(400, "Please provide all required information");

  // create a new user
  user
    .create({
      name: userInput.name,
      email: userInput.email,
      role: userInput.role,
      password: userInput.password,
    })
    .then((newUser) => res.sendResponse(201, newUser))
    .catch((error) => {
      console.log("Create User: ", error);
      if (error.code === 11000) {
        return res.sendResponse(400, "Email already exists");
      }
      return res.sendResponse(500, error.message);
    });
}

async function handleUpdateUser(req, res) {
  if (req.user?.role !== "admin") return res.sendResponse(403, "Unauthorized");

  const userId = req.params.userId;
  const userInput = req.body;

  if (userInput.password) delete userInput.password;
  if (!userId) return res.sendResponse(400, "User ID is required");

  // update user
  await user
    .findByIdAndUpdate(userId, userInput, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.sendResponse(404, "User not found");
      }
      return res.sendResponse(200, updatedUser);
    })
    .catch((error) => {
      console.log("Update User: ", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleDeleteUser(req, res) {
  if (req.user?.role !== "admin") return res.sendResponse(403, "Unauthorized");

  const userId = req.params.userId;

  if (!userId) return res.sendResponse(400, "User ID is required");

  // delete user
  await user
    .findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.sendResponse(404, "User not found");
      }
      return res.sendResponse(200, { message: "User deleted" });
    })
    .catch((error) => {
      console.log("Delete User: ", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleViewAllUsers(req, res) {
  if (req.user?.role !== "admin") return res.sendResponse(403, "Unauthorized");

  const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

  const totalUsers = await user.countDocuments();
  // view all users
  await user
    .find()
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .then((users) =>
      res.sendResponse(200, users, null, {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(page),
      })
    )
    .catch((error) => {
      console.log("View All Users: ", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleResetPassword(req, res) {
  if (req.user?.role !== "admin") return res.sendResponse(403, "Unauthorized");

  const userId = req.params.userId;
  const newPassword = req.body.newPassword;

  if (!userId) return res.sendResponse(400, "User ID is required");
  if (!newPassword) return res.sendResponse(400, "`newPassword` is required");

  // reset password
  await user
    .findByIdAndUpdate(
      userId,
      { password: newPassword, needPasswordChange: true },
      { new: true }
    )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.sendResponse(404, "User not found");
      }
      return res.sendResponse(200, { message: "Password reset" });
    })
    .catch((error) => {
      console.log("Reset Password: ", error);
      return res.sendResponse(500, error.message);
    });
}

module.exports = {
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleViewAllUsers,
  handleResetPassword,
};
