import React from 'react';
import { Box, Heading } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Box>
      <Heading>Welcome to the Auth Example</Heading>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/dashboard">Dashboard</Link>
    </Box>
  );
};

export default Home;
