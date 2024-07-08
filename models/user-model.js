const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now, //現在時間
  },
  thumbnail: {
    //圖片
    type: String,
  },
  //local login (如果是用本地端登入，需要有email & password)
  email: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
