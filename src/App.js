import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Blog from './components/Blog';
import SignUp from './components/signup';
import Login from './components/login';
import CreatePost from './components/create_blog';
import ReadPost from './components/read_post';
import ManagePosts from './components/Manage-Posts';
import ManageUsers from './components/manage-users';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/read-post/:postId" element={<ReadPost />} />
        <Route path="/manage-posts" element={<ManagePosts />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        {/* Define other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App; 
