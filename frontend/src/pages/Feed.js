import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';
import api from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchFeed = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/feed?page=${pageNum}`);
      setPosts(data.posts);
      setPages(data.pages);
      setPage(data.page);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  // Prepend a newly created post to the top of the feed
  const handlePostCreated = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  // Replace a post in place after a like/comment update
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <CreatePost onPostCreated={handlePostCreated} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No posts yet. Be the first to share something!
        </Typography>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onPostUpdated={handlePostUpdated}
          />
        ))
      )}

      {pages > 1 && !loading && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Button
            variant="outlined"
            disabled={page <= 1}
            onClick={() => fetchFeed(page - 1)}
          >
            Previous
          </Button>
          <Typography variant="body2">
            Page {page} of {pages}
          </Typography>
          <Button
            variant="outlined"
            disabled={page >= pages}
            onClick={() => fetchFeed(page + 1)}
          >
            Next
          </Button>
        </Stack>
      )}
    </Container>
  );
}

export default Feed;
