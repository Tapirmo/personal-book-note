const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

//serilize
passport.serializeUser((user, done) => {
  console.log("Serialize使用者。。。");
  // console.log(user);
  done(null, user._id); //將mongoDB的id，存在session
  //並且將id簽名後，以Cookie的形式給使用者。。。
});

//deserilize
passport.deserializeUser(async (_id, done) => {
  console.log(
    "Deserialize使用者。。。使用serializaUser儲存id，去找到資料庫內的資料"
  );
  let foundUser = await User.findOne({ _id });
  done(null, foundUser); //將req.user這個屬性設定為foundUser
});

//Google第三方驗證
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/redirect",
    },
    //function...(可放入try&catch block)
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Strategy的區域");
      //   console.log(profile);
      //   console.log("=======================");
      let foundUser = await User.findOne({
        googleID: profile.id,
      }).exec();
      if (foundUser) {
        console.log("使用者已經註冊過了。無須存入資料庫內。");
        done(null, foundUser);
      } else {
        console.log("偵測到新用戶。須將資料存入資料庫內。");
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("成功創建新用戶。");
        done(null, savedUser);
      }
    }
  )
);

//本地驗證
passport.use(
  new LocalStrategy(async (username, password, done) => {
    //使用email進行驗證
    let foundUser = await User.findOne({ email: username });
    if (foundUser) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        done(null, foundUser); //使serilization儲存資訊
      } else {
        done(null, false); //沒有被local stragies驗證成功
      }
    } else {
      done(null, false);
    }
  })
);
