import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Box>
      <Heading>Welcome to the Auth Example</Heading>
      <Link to="/signin">Sign in</Link>
      <Link to="/signup">Sign up</Link>
      <Link to="/dashboard">Dashboard</Link>
    </Box>
  );
};

export default Home;
