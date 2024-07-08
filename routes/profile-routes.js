const router = require("express").Router();
const Post = require("../models/post-model");

//格式化mongoDB的日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

//authCheck middleware 有被驗證才能往下動作
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); //有被認證繼續
  } else {
    return res.redirect("/auth/login"); //沒被認證，轉到登入頁面
  }
};

//在profile頁面get所post的書評(find書評)
router.get("/", authCheck, async (req, res) => {
  try {
    let postFound = await Post.find({ author: req.user._id }); 

    // 格式化每個書評的日期
    const formattedPosts = postFound.map((post) => ({
      ...post.toObject(), // 將 Mongoose 文檔轉換為obj
      formattedDate: formatDate(post.date),
    }));

    return res.render("profile", {
      user: req.user,
      posts: formattedPosts,
    }); //deSerializeUser()
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).render("error", { message: "無法獲取數據" });
  }
});

//張貼新的書評頁面
router.get("/post", authCheck, (req, res) => {
  return res.render("post", { user: req.user });
});

//post新的書評
router.post("/post", authCheck, async (req, res) => {
  let { title, content, bookAuthor, goodSentences } = req.body;
  let newPost = new Post({
    title,
    content,
    bookAuthor,
    goodSentences,
    author: req.user._id,
  });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch (e) {
    req.flash("error_msg", "標題與內容都需要填寫");
    return res.redirect("/profile/post");
  }
});

//修改書評頁面
router.get("/:_id/update", authCheck, async (req, res) => {
  let { _id } = req.params;
  try {
    let foundPost = await Post.findOne({ _id }).exec();
    if (foundPost != null) {
      return res.render("update", { foundPost, user: req.user });
    } else {
      return res.status(400).send(e);
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

//成功修改書評
router.patch("/:_id", authCheck, async (req, res) => {
  try {
    let { _id } = req.params;
    let updatedPost = await Post.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) {
      return res.status(404).send("找不到該書評");
    }

    return res.render("update-success", {
      user: req.user,
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

//確認書評是否刪除
router.get("/:_id/deleteCheck", authCheck, async(req,res)=>{
  console.log("資料刪除確認");
  let { _id } =req.params;
  try {
    let deletePost = await Post.findOne({ _id }).exec();

    if (deletePost != null) {
      return res.render("delete-check", {
        deletePost,
        user: req.user,
      });
    } else {
      return res.status(400).render("error-page");
    }
  } catch (e) {
    return res.status(400).render("error-page");
  }
})

//刪除書評
router.delete("/:_id/delete", authCheck, async (req, res) => {
  console.log("正在刪除資料");
  let { _id } = req.params;
  try {
    let deleteResult = await Post.deleteOne({ _id }).exec();

    return res.render("delete-success", {
      deleteResult,
      user: req.user,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
