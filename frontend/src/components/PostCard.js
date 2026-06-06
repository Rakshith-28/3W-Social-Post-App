import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  TextField,
  Divider,
  Collapse,
  Tooltip,
  Badge,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../api';

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Deterministic gradient per username so each user gets a consistent avatar color
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
];

const gradientFor = (name = '') => {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
};

// Full, readable date for tooltips
const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

// Compact relative timestamp, e.g. "just now", "3m ago", "2h ago", "5d ago"
const timeAgo = (iso) => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 45) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function PostCard({ post, currentUser, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liked = post.likes?.includes(currentUser?.username);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      onPostUpdated(data.post);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      onPostUpdated(data);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await api.delete(
        `/posts/${post._id}/comment/${commentId}`
      );
      onPostUpdated(data);
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
        animation: `fadeInUp 0.3s ${EASING}`,
        transition: `transform 0.3s ${EASING}, box-shadow 0.3s ${EASING}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              backgroundImage: gradientFor(post.username),
              fontWeight: 700,
            }}
          >
            {post.username?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {post.username}
          </Typography>
        }
        subheader={
          <Tooltip title={formatDate(post.createdAt)} arrow placement="bottom-start">
            <Typography variant="caption" color="text.secondary">
              {timeAgo(post.createdAt)}
            </Typography>
          </Tooltip>
        }
      />

      {post.text && (
        <CardContent sx={{ pt: 0 }}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'text.primary' }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box
          component="img"
          src={post.image}
          alt="post"
          sx={{
            width: '100%',
            maxHeight: 500,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}

      <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
        <Tooltip title={liked ? 'Unlike' : 'Like'} arrow>
          <IconButton
            onClick={handleLike}
            color="secondary"
            sx={{
              '&:hover': { transform: 'scale(1.18)' },
              '&:active': { transform: 'scale(0.9)' },
            }}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ mr: 2, fontWeight: 600, minWidth: 12 }}>
          {likeCount}
        </Typography>

        <Tooltip title="Comments" arrow>
          <IconButton
            onClick={() => setShowComments((s) => !s)}
            color={showComments ? 'primary' : 'default'}
            sx={{ '&:hover': { transform: 'scale(1.12)' } }}
          >
            <Badge color="primary" variant={commentCount ? 'dot' : 'standard'}>
              <ChatBubbleOutlineIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {commentCount}
        </Typography>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.015)' }}>
          {/* Add comment form */}
          <Box
            component="form"
            onSubmit={handleAddComment}
            sx={{ display: 'flex', gap: 1, mb: 2 }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ bgcolor: 'background.paper', borderRadius: 3 }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={submitting || !commentText.trim()}
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.16)' },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Comments list */}
          {commentCount === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ py: 1.5 }}
            >
              No comments yet — start the conversation.
            </Typography>
          ) : (
            post.comments.map((comment) => (
              <Box
                key={comment._id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 1.5,
                  animation: `fadeIn 0.3s ${EASING}`,
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: 14,
                    fontWeight: 700,
                    mr: 1.25,
                    backgroundImage: gradientFor(comment.username),
                  }}
                >
                  {comment.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    flexGrow: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    px: 1.5,
                    py: 1,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {comment.username}
                    </Typography>
                    <Tooltip title={formatDate(comment.createdAt)} arrow>
                      <Typography variant="caption" color="text.secondary">
                        {timeAgo(comment.createdAt)}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.25, lineHeight: 1.5 }}>
                    {comment.text}
                  </Typography>
                </Box>
                {comment.username === currentUser?.username && (
                  <Tooltip title="Delete comment" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(comment._id)}
                      sx={{
                        ml: 0.5,
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Card>
  );
}

export default PostCard;
