import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./Header";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

const defaultTheme = createTheme();

const CommentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const ReplyCard = styled(Card)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  marginTop: theme.spacing(1),
  background: theme.palette.grey[100],
}));

const ReadPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showReplyField, setShowReplyField] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const sections = [];

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const foundPost = storedPosts.find((p) => p.id === parseInt(postId));
    setPost(foundPost);
  }, [postId]);

  const handleDelete = () => {
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const updatedPosts = storedPosts.filter((p) => p.id !== parseInt(postId));
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    navigate("/");
  };

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  const submitComment = () => {
    if (!newComment.trim()) {
      setAlert({
        show: true,
        message: "Comment cannot be blank.",
        severity: "error",
      });
      return;
    }
    const comment = {
      id: Date.now(),
      author: loggedInUser.username,
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), comment],
    };
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const postIndex = storedPosts.findIndex((p) => p.id === parseInt(postId));
    storedPosts[postIndex] = updatedPost;

    localStorage.setItem("blogPosts", JSON.stringify(storedPosts));
    setPost(updatedPost);
    setNewComment("");
  };

  const submitReply = (commentId) => {
    if (!replyContent.trim()) {
      setAlert({
        show: true,
        message: "Reply cannot be blank.",
        severity: "error",
      });
      return;
    }
    const reply = {
      id: Date.now(),
      author: loggedInUser.username,
      content: replyContent,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = post.comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...(comment.replies || []), reply] };
      }
      return comment;
    });

    const updatedPost = { ...post, comments: updatedComments };
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const postIndex = storedPosts.findIndex((p) => p.id === parseInt(postId));
    storedPosts[postIndex] = updatedPost;

    localStorage.setItem("blogPosts", JSON.stringify(storedPosts));
    setPost(updatedPost);
    setReplyContent("");
    setShowReplyField(null);
  };

  if (!post) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Header sections={sections} title="Read Blog" />
          <Typography variant="h5" align="center" marginTop={8}>
            Post not found.
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  const date = new Date(post.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container>
        <Header sections={sections} title="Blog Platform" />
        <Typography variant="h3" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Author: {post.author}
        </Typography>
        {loggedInUser && loggedInUser.username === post.author && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Post
          </Button>
        )}
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Published on {formattedDate} at {formattedTime}
        </Typography>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              margin: "auto",
              display: "block",
              marginBottom: "20px",
            }}
          />
        )}
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        {/* Comment Form */}
        {loggedInUser && (
          <Box my={2}>
            {alert.show && (
              <Alert
                severity={alert.severity}
                onClose={() =>
                  setAlert({ show: false, message: "", severity: "info" })
                }
              >
                {alert.message}
              </Alert>
            )}
            <TextField
              label="Leave a comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              margin="normal"
            />
            <Button onClick={submitComment} variant="contained" sx={{ mt: 1 }}>
              Post Comment
            </Button>
          </Box>
        )}
        {/* Comments Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Comments
        </Typography>
        {post.comments &&
          post.comments.map((comment) => (
            <CommentCard key={comment.id}>
              <CardContent>
                <Typography variant="subtitle2">{comment.author}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {comment.content}
                </Typography>
                {loggedInUser && post.author === loggedInUser.username && (
                  <>
                    <Button
                      size="small"
                      onClick={() => setShowReplyField(comment.id)}
                    >
                      Reply
                    </Button>
                    {showReplyField === comment.id && (
                      <Box mt={2}>
                        <TextField
                          label="Write a reply"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          margin="normal"
                        />
                        <Button
                          onClick={() => submitReply(comment.id)}
                          variant="contained"
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Submit Reply
                        </Button>
                      </Box>
                    )}
                  </>
                )}
                {/* Replies */}
                {comment.replies &&
                  comment.replies.map((reply) => (
                    <ReplyCard key={reply.id}>
                      <CardContent>
                        <Typography variant="subtitle2">
                          {reply.author}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {reply.content}
                        </Typography>
                      </CardContent>
                    </ReplyCard>
                  ))}
              </CardContent>
            </CommentCard>
          ))}
      </Container>
    </ThemeProvider>
  );
};

export default ReadPost;
