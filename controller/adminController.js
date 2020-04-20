const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.createAdmin = (req, res, next) => {
  let user;
  User.findById(req.userId)
    .then((user) => {
      user.status = "Admin";
      return user.save();
    })
    .then((user) => {
      user = user;
      Post.find()
        .then((result) => {
          if (!result) {
            res.status(200).json({ message: "No posts for this user" });
          }
          let postsByUser = [];
          result.forEach((element) => {
            console.log(element.creator);
            console.log(req.userId);
            if (element.creator == req.userId) {
              element.isAdmin = true;
              postsByUser.push(element);
            }
          });

          res.status(200).json({
            message: "Post fetch successfully",
            nrOfPosts: postsByUser.length,
            post: postsByUser,
            user: user,
          });
        })
        .catch((err) => {
          res.status(500).json({ message: "Wrong", error: err });
        });
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed, entered data is incorrect." });
  }
  const title = req.body.title;
  const content = req.body.content;
  const postId = req.params.postId;
  Post.findById(postId)
    .then((result) => {
      result.title = title;
      result.content = content;
      return result.save();
    })
    .then((result) => {
      return res
        .status(200)
        .json({ message: "Post id=" + postId + "find", post: result });
    })
    .catch((err) => {
      res.status(400).json({ message: "Wrong", error: err });
    });
};
