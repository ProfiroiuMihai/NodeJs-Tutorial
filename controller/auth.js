const { validationResult } = require("express-validator/check");
const brycpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = require("../middleware/secret");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    return res.status(error.statusCode).json({ message: error.data });
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  brycpt
    .hash(password, 12)
    .then((hashPass) => {
      const user = User({
        email: email,
        password: hashPass,
        name: name,
      });
      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({ message: "User succesfully", user: result });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong in db",
            errors: err,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Crash",
        errors: err,
      });
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    return res.status(error.statusCode).json({ message: error.data });
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user)
        return res.status(401).json({
          message: "User not found",
        });

      brycpt.compare(password, user.password).then((isEqual) => {
        if (!isEqual) {
          return res.status(401).json({
            message: "Wrong Password",
          });
        }

        const token = jwt.sign(
          { email: user.email, userId: user._id.toString() },
          secret,
          { expiresIn: "1h" }
        );
        return res.status(200).json({
          message: "Success",
          token: token,
          userId: user._id,
        });
      }).catch((err) => {
        return res.status(500).json({
          message: "Server error",
          errors: err,
        });
      });;
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Server error",
        errors: err,
      });
    });
};
