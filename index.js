const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// 連結MongoDB
mongoose
  .connect("mongodb://localhost:27017/NoteDB")
  .then(() => {
    console.log("Connecting to NoteDB...");
  })
  .catch((e) => {
    console.log(e);
  });

// 設定middleware及排版引擎
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// 使passport運行認證功能
app.use(passport.initialize());
// 使passport能夠使用session
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// routor
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// 404 錯誤處理應該放在所有其他路由之後
app.use((req, res) => {
  res.status(404).render("error-page", { user: req.user });
});

// 聆聽正在運作的伺服器
app.listen(8080, () => {
  console.log("Server running on port 8080...");
});