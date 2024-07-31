import React from "react";
import { Flex,Box } from "@chakra-ui/react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <Flex flexDirection={{ base: "column",lg:'row' }} minH={{base:'10vh',lg:"100vh"}} w={"100%"}>
      <Sidebar />
      <Box h={"100%"} w={"100%"} overflow={'hidden'}>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;
