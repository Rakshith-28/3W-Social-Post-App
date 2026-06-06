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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../api';

// Format an ISO date into a readable string
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

function PostCard({ post, currentUser, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liked = post.likes?.includes(currentUser?.username);

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
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.username?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={post.username}
        subheader={formatDate(post.createdAt)}
      />

      {post.text && (
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box
          component="img"
          src={post.image}
          alt="post"
          sx={{ width: '100%', maxHeight: 500, objectFit: 'cover' }}
        />
      )}

      <CardActions disableSpacing>
        <IconButton onClick={handleLike} color="secondary">
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {post.likes?.length || 0}
        </Typography>

        <IconButton onClick={() => setShowComments((s) => !s)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2">
          {post.comments?.length || 0}
        </Typography>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2 }}>
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
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={submitting || !commentText.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>

          {/* Comments list */}
          {post.comments?.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          ) : (
            post.comments.map((comment) => (
              <Box
                key={comment._id}
                sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 14,
                    mr: 1,
                    bgcolor: 'secondary.main',
                  }}
                >
                  {comment.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" component="span">
                    {comment.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {formatDate(comment.createdAt)}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
                {comment.username === currentUser?.username && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
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
