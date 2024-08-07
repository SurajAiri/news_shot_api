// own account => update account, view own account, reset password (current password required)
const { signJwtToken } = require("../services/auth.services");
const user = require("../models/user.model");
const bcrypt = require("bcrypt");

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendResponse(400, "Email and password are required");
  }

  // find user
  await user
    .findOne({ email })
    .select("+password")
    .then(async (foundUser) => {
      if (!foundUser) {
        return res.sendResponse(404, "User not found");
      }

      // check password
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        return res.sendResponse(401, "Invalid password");
      }

      // generate token
      const token = signJwtToken(foundUser);
      // todo: add refresh token later

      // remove password from response
      foundUser.password = undefined;

      return res.sendResponse(200, { user: foundUser, accessToken: token });
    })
    .catch((error) => {
      console.log("Login: ", error);
      return res.sendResponse(500, error.message);
    });
}

// todo: implement later
// async function handleUserLogout(req, res) {}

async function handleUserUpdate(req, res) {
  const userId = req.user?.id;
  const name = req.body.name;

  if (!userId) return res.sendResponse(400, "Authentication required");

  // if body contains any of field except name remove them)
  if (!name) return res.sendResponse(400, "Can only update name");

  // update user
  await user
    .findByIdAndUpdate(userId, { name: name }, { new: true })
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

// change password
async function handleUserPasswordChange(req, res) {
  const userId = req.user?.id;
  // console.log(req.user);
  const { currentPassword, newPassword } = req.body;

  if (!userId) return res.sendResponse(400, "Authentication required");
  if (!currentPassword || !newPassword)
    return res.sendResponse(
      400,
      "Current password and new password are required"
    );

  try {
    // check password
    let mUser = await user.findById(userId).select("+password");
    const isMatch = await bcrypt.compare(currentPassword, mUser.password);
    if (!isMatch) {
      return res.sendResponse(401, "Invalid password");
    }

    // update password
    mUser.password = newPassword;
    mUser.needPasswordChange = false;
    await mUser.save().then((updatedUser) => {
      return res.sendResponse(200, { message: "Password changed" });
    });
  } catch (error) {
    console.log("Change Password: ", error);
    return res.sendResponse(500, error.message);
  }
}

module.exports = {
  handleUserLogin,
  handleUserUpdate,
  handleUserPasswordChange,
};
