import React from "react";
import { Flex } from "@chakra-ui/react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <Flex>
      <Sidebar />
      <Flex flexDirection="column" flex="1">
        {" "}
        {/* Adjust `ml` to match the width of Sidebar */}
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default Layout;
