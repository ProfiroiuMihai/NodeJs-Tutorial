const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controller/adminController");

const router = express.Router();

// POST /admin/createAdmin
router.get("/createAdmin", isAuth, adminController.createAdmin);

// POST /admin/updatePost/postId
router.post(
  "/updatePost/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuth,
  adminController.updatePost
);

module.exports = router;
