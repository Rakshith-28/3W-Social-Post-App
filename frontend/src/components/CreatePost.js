import React, { useState, useRef } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  Typography,
  LinearProgress,
  Avatar,
  Collapse,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import api from '../api';

const MAX_CHARS = 500;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(''); // Base64 string
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    // Keep Base64 payloads reasonable (~2MB raw file)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim() && !image) {
      setError('Add some text or an image to post');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/posts/create', { text, image });
      onPostCreated(data);
      // Reset the form
      setText('');
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const charsLeft = MAX_CHARS - text.length;
  const charColor =
    charsLeft <= 0 ? 'error.main' : charsLeft <= 50 ? 'warning.main' : 'text.secondary';
  const canPost = (text.trim() || image) && !loading;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Thin gradient accent bar that doubles as the loading indicator */}
      <Box sx={{ height: 4 }}>
        {loading ? (
          <LinearProgress sx={{ height: 4 }} />
        ) : (
          <Box
            sx={{
              height: 4,
              backgroundImage:
                'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Collapse in={Boolean(error)} unmountOnExit>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                backgroundImage:
                  'linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)',
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              <ImageIcon fontSize="small" />
            </Avatar>
            <TextField
              placeholder="What's on your mind?"
              multiline
              minRows={2}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              inputProps={{ maxLength: MAX_CHARS }}
            />
          </Box>

          {/* Character counter */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ color: charColor, fontWeight: 600 }}>
              {text.length}/{MAX_CHARS}
            </Typography>
          </Box>

          <Collapse in={Boolean(image)} unmountOnExit>
            <Box sx={{ position: 'relative', mt: 1, display: 'inline-block' }}>
              <Box
                component="img"
                src={image}
                alt="preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 320,
                  borderRadius: 3,
                  display: 'block',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              />
              <IconButton
                size="small"
                onClick={removeImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Collapse>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Button
              component="label"
              startIcon={<ImageIcon />}
              color="primary"
              disabled={loading}
              sx={{
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
              }}
            >
              Add Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canPost}
              endIcon={!loading && <SendIcon />}
              sx={{ minWidth: 110, transition: `all 0.3s ${EASING}` }}
            >
              {loading ? 'Posting…' : 'Post'}
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
}

export default CreatePost;
