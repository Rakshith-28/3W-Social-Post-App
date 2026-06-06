import React, { useState, useRef } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import api from '../api';

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

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          placeholder="What's on your mind?"
          multiline
          minRows={2}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {image && (
          <Box sx={{ position: 'relative', mt: 2, display: 'inline-block' }}>
            <img
              src={image}
              alt="preview"
              style={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 8,
                display: 'block',
              }}
            />
            <IconButton
              size="small"
              onClick={removeImage}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

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
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : 'Post'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default CreatePost;
