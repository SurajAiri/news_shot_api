const { default: mongoose } = require("mongoose");
const responseFormatter = require("./middlewares/response.middlewares");
require("dotenv").config();
const {
  checkForAuthorization,
  restrictUserPermission,
} = require("./middlewares/auth.middlewares");
const dbUrl = process.env.MONGO_URI;
express = require("express");
app = express();

app.use(express.json());
app.use(responseFormatter);
app.use(checkForAuthorization);

app.get("/", (req, res) =>
  res.sendResponse(200, { message: "Welcome to the API" }),
);

// s meaning staff, a meaning admin, u meaning user
app.use("/api/v1/website", require("./routes/website.routes"));
app.use("/api/v1/staff/auth", require("./routes/auth.routes"));
app.use(
  "/api/v1/news",
  restrictUserPermission(["summarizer", "verifier", "admin"]),
  require("./routes/news.routes"),
);
app.use(
  "/api/v1/admin/user",
  // restrictUserPermission(["admin"]),
  require("./routes/admin_user_manage.routes"),
);
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`),
);
