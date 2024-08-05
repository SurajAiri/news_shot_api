const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["viewer", "summarizer", "verifier", "admin"],
    default: "viewer",
  },
  //   refreshToken: {
  //     type: String,
  //   },
  // todo: email verification implement later
  isEmailVerified: {
    type: Boolean,
    default: true,
    select: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  needPasswordChange: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
