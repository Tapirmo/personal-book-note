const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

//登入route
router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

//登出route
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    return res.redirect("/"); //返回到首頁
  });
});

//註冊route
router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});

//get Google驗證後的個人資料
router.get(
  //固定寫法，參考passport網站 本身是middleware
  "/google",
  passport.authenticate("google", {
    //passport執行authenticate時，會找strategies
    scope: ["profile", "email"], //scope可上官網查看，想添加的資料
    prompt: "select_account", //每次到登入頁面時，可以選擇一個帳號登入
  })
);

//送出註冊資料，如果資料有誤，會有Flash彈窗
router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  //如果有人使用postman寄出資訊的話，ejs設定最小長度為8就沒有用，因此一定要在js設計
  if (password.length < 8) {
    req.flash("error_msg", "密碼長度過短，至少需要8個數字或英文字。");
    return res.redirect("/auth/signup");
  }

//確認信箱是否被註冊過
  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    req.flash(
      "error_msg",
      "信箱已經被註冊。請使用另一個信箱，或者嘗試使用此信箱登入系統。"
    );
    return res.redirect("/auth/signup");
  }

  let hashedPassword = await bcrypt.hash(password, 12);
  let newUser = new User({ name, email, password: hashedPassword });
  await newUser.save(); //儲存新的使用者
  req.flash("sucess_msg", "恭喜註冊成功! 現在可以登入系統了!");
  return res.redirect("/auth/login");
});

//本地驗證，輸入帳號密碼
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login", //登入失敗的導向位置
    failureFlash: "登入失敗。帳號或密碼不正確。", //登入失敗，彈出的訊息
    //自動套入 res.locals.error_msg = req.flash("error_msg"); 
  }),
  (req, res) => {
    return res.redirect("/profile"); //登入正確導向個人頁面
  }
);

//google驗證routes
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("進入redirect區域");
  return res.redirect("/profile");
});

module.exports = router;
