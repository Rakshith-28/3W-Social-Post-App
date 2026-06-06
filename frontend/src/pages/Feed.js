import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Skeleton,
  Fade,
  Chip,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import api from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Placeholder card shown while the feed is loading
function PostSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2,
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1.5 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="35%" height={20} />
          <Skeleton variant="text" width="20%" height={16} />
        </Box>
      </Box>
      <Skeleton variant="text" width="95%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton
        variant="rounded"
        height={180}
        sx={{ mt: 1.5, borderRadius: 3 }}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
        <Skeleton variant="rounded" width={56} height={28} />
        <Skeleton variant="rounded" width={56} height={28} />
      </Box>
    </Paper>
  );
}

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

  const goToPage = (pageNum) => {
    fetchFeed(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* Page heading */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Your Feed
        </Typography>
        <Typography variant="body2" color="text.secondary">
          See the latest from the community, {user?.username}.
        </Typography>
      </Box>

      <CreatePost onPostCreated={handlePostCreated} />

      {loading ? (
        <Box>
          {[0, 1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </Box>
      ) : posts.length === 0 ? (
        <Fade in timeout={400}>
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 6,
              px: 3,
              mt: 1,
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                backgroundImage:
                  'linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)',
              }}
            >
              <ForumOutlinedIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Be the first to share something with the community!
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Box>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onPostUpdated={handlePostUpdated}
            />
          ))}
        </Box>
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
            startIcon={<NavigateBeforeIcon />}
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>
          <Chip
            label={`Page ${page} of ${pages}`}
            sx={{ fontWeight: 600, transition: `all 0.3s ${EASING}` }}
          />
          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            disabled={page >= pages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </Stack>
      )}
    </Container>
  );
}

export default Feed;
