const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((result) => {
      if (!result) {
        res.status(200).json({ message: "No posts for this user" });
      }
      let postsByUser=[];
      result.forEach(element =>{
        console.log(element.creator)
        console.log(req.userId)
        if(element.creator == req.userId)
        postsByUser.push(element);
      })

      res.status(200).json({
        message: "Post fetch successfully",
        nrOfPosts: postsByUser.length,
        post: postsByUser,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Wrong", error: err });
    });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return res.status(error.statusCode).json({ message: error });
  }
  //   if (!req.file) {
  //     const error = new Error('No image provided.');
  //     error.statusCode = 422;
  //     throw error;
  //   }
  //   const imageUrl = req.file.path;

  const imageUrl = "image path";
  const title = req.body.title;
  const content = req.body.content;
  const post = Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.push(post);
      return user.save();
    })
    .then((userSaved) => {
      res.status(201).json({
        message: "PostCreated succesfully",
        post: post,
        userId: userSaved._id,
        userName: userSaved.name,
      });
    })
    .catch((err) => {
      console.log(err);
      // const error = new Error("Something went wrong in db");
      // error.status(500);
      // throw error;

      return res.status(500).json({
        message: "Something went wrong in db",
        errors: errors.array(),
      });
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((result) => {
      res
        .status(200)
        .json({ message: "Post id=" + postId + "find", post: result });
    })
    .catch((err) => {
      res.status(400).json({ message: "Wrong", error: err });
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return res.status(error.statusCode).json({ message: error });
  }
  const imageUrl = "image path";
  const title = req.body.title;
  const content = req.body.content;
  const postId = req.params.postId;
  Post.findById(postId)
    .then((result) => {
      result.title = title;
      result.content = content;
      result.imageUrl = imageUrl;

      if (result.creator != req.userId)
        return res
          .status(200)
          .json({ message: "This user does not have acces to this post" });

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

exports.deletePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    return res.status(error.statusCode).json({ message: error });
  }
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post does not exist" });
      }
      if (post.creator != req.userId)
        return res
          .status(401)
          .json({ message: "This user does not have acces to this post" });
      return post.delete();
    })
    .then((post) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((post) => {
      return res.status(200).json({ message: "Succesfully deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Wrong", error: err });
    });
};
