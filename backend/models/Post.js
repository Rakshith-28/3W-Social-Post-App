const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
    trim: true,
  },
  // Base64 encoded image string
  image: {
    type: String,
    default: '',
  },
  // Array of usernames who liked the post
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure at least one of text or image is present
postSchema.pre('validate', function (next) {
  const hasText = this.text && this.text.trim().length > 0;
  const hasImage = this.image && this.image.trim().length > 0;
  if (!hasText && !hasImage) {
    return next(new Error('A post must contain text or an image'));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
