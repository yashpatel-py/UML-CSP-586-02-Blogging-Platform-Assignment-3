import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Header from "./Header";

const categories = [
  "Academic Resources",
  "Career Services",
  "Campus",
  "Local Community Resources",
  "Social, Sports",
  "Health and Wellness",
  "Technology",
  "Travel",
  "Alumni",
];

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setPost((prevPost) => ({ ...prevPost, author: user.username }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPost((prevPost) => ({ ...prevPost, imageUrl: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const createdAt = new Date().toISOString(); // Automatically set the "Created At" date
    const newPost = { ...post, id: new Date().getTime(), createdAt };
    storedPosts.push(newPost);
    localStorage.setItem("blogPosts", JSON.stringify(storedPosts));
    alert("Post created successfully!");
    setPost({
      title: "",
      content: "",
      author: post.author,
      category: "",
      imageUrl: "",
    }); // Reset form fields
  };

  // Define the sections for the Header
  const sections = [];

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Header sections={sections} title="Sign Up" />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography component="h1" variant="h5">
          Create Blog Post
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Post Title"
            name="title"
            autoFocus
            value={post.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="content"
            label="Content"
            id="content"
            multiline
            rows={4}
            value={post.content}
            onChange={handleChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category"
              name="category"
              value={post.category}
              label="Category"
              onChange={handleChange}
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" sx={{ mt: 2, mb: 2 }}>
              Upload Image
            </Button>
          </label>
          {post.imageUrl && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2">Image Preview:</Typography>
              <img
                src={post.imageUrl}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit Post
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePost;
