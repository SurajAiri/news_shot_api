const { default: mongoose } = require("mongoose");
const responseFormatter = require("./middlewares/response.middlewares");
const user = require("./models/user.model");
const {
  checkForAuthorization,
  restrictUserPermission,
} = require("./middlewares/auth.middlewares");

express = require("express");
app = express();

authRoutes = require("./routes/auth.routes");
userManageRoutes = require("./routes/admin_user_manage.routes");

app.use(express.json());
app.use(responseFormatter);
app.use(checkForAuthorization);

app.get("/", (req, res) =>
  res.sendResponse(200, { message: "Welcome to the API" })
);
app.get("/test/:userId", (req, res) => {
  const userId = req.params.userId;
  user
    .findById(userId)
    .then((user) => {
      console.log(user); // Password will not be included
    })
    .catch((error) => {
      console.error(error);
    });
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/admin/user",
  restrictUserPermission(["admin"]),
  userManageRoutes
);

mongoose
  //   .connect(process.env.MONGO_URI)
  .connect("mongodb://127.0.0.1:27017/news_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => process.env.MONGO_URI);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
