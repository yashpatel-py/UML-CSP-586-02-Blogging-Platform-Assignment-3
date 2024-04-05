import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import FeaturedPost from "./FeaturedPost";
import Footer from "./Footer";
import Typography from "@mui/material/Typography";

const initializeUsers = () => {
  const initialUsers = [
    {
      username: "adminUser",
      email: "admin@example.com",
      password: "admin", // base64 encoding for example
      role: "admin",
      is_activated: true,
    },
    {
      username: "moderatorUser",
      email: "moderator@example.com",
      password: "moderator", // base64 encoding for example
      role: "moderator",
      is_activated: true,
    },
  ];

  // Only add these users if they don't exist in local storage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  initialUsers.forEach((user) => {
    if (!users.some((u) => u.username === user.username)) {
      users.push(user);
    }
  });
  localStorage.setItem("users", JSON.stringify(users));
};

const blogSections = [
  { title: "Academic Resources", url: "/academic-resources" },
  { title: "Career Services", url: "/career-ervices" },
  { title: "Campus", url: "/travel" },
  { title: "Local Community Resources", url: "/food" },
  { title: "Social", url: "/culture" },
  { title: "Sports", url: "/culture" },
  { title: "Health and Wellness", url: "/health" },
  { title: "Technology", url: "/tech" },
  { title: "Travel", url: "/travel" },
  { title: "Alumni", url: "/alumni" },
];

const defaultTheme = createTheme();

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    initializeUsers(); // Initialize admin and moderator users

    const storedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setBlogPosts(storedPosts);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header sections={blogSections} title="Blog Platform" />
        <main>
          {blogPosts.length > 0 ? (
            <Grid container spacing={4}>
              {blogPosts.map((post, index) => (
                <FeaturedPost key={index} post={post} />
              ))}
            </Grid>
          ) : (
            <Typography variant="h6" align="center" marginTop={2}>
              No blogs to show.
            </Typography>
          )}
        </main>
        <Footer
          title="Footer"
          description="Something here to give the footer a purpose!"
        />
      </Container>
    </ThemeProvider>
  );
}
