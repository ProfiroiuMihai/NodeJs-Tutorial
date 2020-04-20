const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const feedController = require('../controller/feed');

const router = express.Router(); 

// GET /feed/post
router.get('/posts',isAuth,feedController.getPosts);

// POST /feed/post
router.post('/posts',
[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5}),
],isAuth,
feedController.postPost);


router.get('/post/:postId',isAuth,feedController.getPost)

// PUT /feed/post
router.put('/post/:postId',isAuth,feedController.updatePost)

// DELTE /feed/post
router.delete('/post/:postId',isAuth,feedController.deletePost)

module.exports = router;