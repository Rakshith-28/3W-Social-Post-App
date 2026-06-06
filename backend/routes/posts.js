const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/posts/create
// @desc    Create a new post (text and/or image)
router.post('/create', auth, async (req, res) => {
  try {
    const { text, image } = req.body;

    const hasText = text && text.trim().length > 0;
    const hasImage = image && image.trim().length > 0;

    if (!hasText && !hasImage) {
      return res
        .status(400)
        .json({ message: 'Post must contain text or an image' });
    }

    const post = await Post.create({
      userId: req.user.id,
      username: req.user.username,
      text: hasText ? text.trim() : '',
      image: hasImage ? image : '',
    });

    return res.status(201).json(post);
  } catch (err) {
    if (err.name === 'ValidationError' || err.message) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   GET /api/posts/feed
// @desc    Get paginated feed of all posts (10 per page), newest first
router.get('/feed', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(),
    ]);

    return res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching feed' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle a like on a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const username = req.user.username;
    const index = post.likes.indexOf(username);
    let liked;

    if (index === -1) {
      post.likes.push(username);
      liked = true;
    } else {
      post.likes.splice(index, 1);
      liked = false;
    }

    await post.save();
    return res.json({ post, liked });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error toggling like' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      userId: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });

    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error adding comment' });
  }
});

// @route   DELETE /api/posts/:postId/comment/:commentId
// @desc    Delete a comment (only the comment author)
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the author may delete their comment
    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error deleting comment' });
  }
});

module.exports = router;
