import { useState, ReactNode } from "react";
import { Flex, Box, Button, Text, Image } from "@chakra-ui/react";
import { ColorSideBar, ColorText } from "../templatecolor";
import { NavLink, useLocation } from "react-router-dom";
import Logout from "../Auth/Logout";
import "./Sidebar.css";

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  const initialShowRightSidebar = Array.from({ length: 5 }, () => false); // Config open btn-sidebar

  const [showRightSidebar, setShowRightSidebar] = useState<boolean[]>(
    initialShowRightSidebar
  );
  const [showTemplateSidebar, setShowTemplateSidebar] = useState<boolean>(true);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const toggleRightSidebar = (index: number) => {
    setShowRightSidebar((prev) =>
      prev.map((show, i) => {
        if (i === index) {
          return !show; // Toggle the selected menu
        }
        return false; // Hide other menus
      })
    );
    setShowTemplateSidebar(
      showRightSidebar.every((show, i) =>
        i === index ? showRightSidebar[i] : !show
      )
    );
    if (index === 0) {
      setShowDashboard(!showDashboard); // Toggle Dashboard
    } else {
      setShowDashboard(false); // Hide Dashboard if other menu is clicked
    }
  };
  const myLocation = location.pathname.split("/");
  console.log(myLocation);

  return (
    <Flex className="flex">
      {/* Sidebar */}
      <Flex>
        {/* Left Sidebar */}
        <Flex
          flexDirection="column"
          alignItems="center"
          width="80px"
          height="100vh"
          py="20"
          bg={ColorSideBar.Sidebar}
        >
          {/* DashBoard Menu */}
          <Flex
            w={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            mb={8}
          >
            <Button
              h={"65px"}
              py={0}
              bg={
                location.pathname === "/dashboard"
                  ? ColorSideBar.BtnSideBarHover
                  : ColorSideBar.Sidebar
              }
              onClick={() => toggleRightSidebar(0)}
              _hover={{ bg: ColorSideBar.BtnSideBarHover }}
              borderRadius={"12px"}
            >
              <NavLink to={"/dashboard"} style={{ padding: 0 }}>
                <Image src="/StaticIcon.png" />
              </NavLink>
            </Button>
          </Flex>

          {/* Customer Menu */}
          <Flex
            w={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            mb={8}
          >
            <Button
              h={"65px"}
              py={0}
              bg={
                myLocation[1] === "customers"
                  ? ColorSideBar.BtnSideBarHover
                  : ColorSideBar.Sidebar
              }
              onClick={() => toggleRightSidebar(1)}
              _hover={{ bg: ColorSideBar.BtnSideBarHover }}
              borderRadius={"12px"}
            >
              <NavLink to={"/customers/customer"} style={{ padding: 0 }}>
                <Image src="/CustomersIcon.png" />
              </NavLink>
            </Button>
          </Flex>

          {/* Projects Menu */}
          <Flex
            w={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            mb={8}
          >
            <Button
              h={"65px"}
              py={0}
              bg={ColorSideBar.Sidebar}
              onClick={() => toggleRightSidebar(2)}
              _hover={{ bg: ColorSideBar.BtnSideBarHover }}
              borderRadius={"12px"}
            >
              <Image src="/ProjectsIcon.png" />
            </Button>
          </Flex>

          {/* Support Tickets Menu */}
          <Flex
            w={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            mb={8}
          >
            <Button
              h={"65px"}
              py={0}
              bg={ColorSideBar.Sidebar}
              onClick={() => toggleRightSidebar(3)}
              _hover={{ bg: ColorSideBar.BtnSideBarHover }}
              borderRadius={"12px"}
            >
              <Image src="/SupTicketsIcon.png" />
            </Button>
          </Flex>

          {/* Support Agent Menu */}
          <Flex
            w={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            mb={8}
          >
            <Button
              h={"65px"}
              py={0}
              bg={ColorSideBar.Sidebar}
              onClick={() => toggleRightSidebar(4)}
              _hover={{ bg: ColorSideBar.BtnSideBarHover }}
              borderRadius={"12px"}
            >
              <Image src="/ServiceAgentsIcon.png" />
            </Button>
          </Flex>
          <Box>
            <Logout />
          </Box>
        </Flex>

        {/* Right Sidebar */}
        {/* template Right sidebar */}
        <Box
          h="100vh"
          py="8"
          overflowY="auto"
          bg={ColorSideBar.rSidebar}
          w="60"
          display={showTemplateSidebar ? "block" : "none"}
          borderColor={"#E2E8E8"}
        ></Box>

        {/* DashBoard */}
        <Box
          h="100vh"
          py="8"
          overflowY="auto"
          bg={ColorSideBar.rSidebar}
          borderRight="1px"
          w="60"
          display={showRightSidebar[0] ? "block" : "none"}
          borderColor={"#E2E8E8"}
        >
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform={"uppercase"}
          >
            Dashboard
          </Text>

          {/* Option in Menu */}
          <Flex w={"100%"} mt="5" px={0}>
            {/* Example of Chakra UI Button */}
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              bg={ColorSideBar.rSidebar}
              fontSize={"16px"}
              fontWeight={"bold"}
              borderRadius={"12px"}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
              onClick={() => setShowDashboard(!showDashboard)}
            >
              <NavLink
                to={"/dashboard"}
                // className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </NavLink>
            </Box>
          </Flex>
        </Box>

        {/* Customer */}
        <Box
          h="100vh"
          py="8"
          overflowY="auto"
          bg={ColorSideBar.rSidebar}
          borderRight="1px"
          w="60"
          display={showRightSidebar[1] ? "block" : "none"}
          borderColor={"#E2E8E8"}
        >
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform={"uppercase"}
          >
            Customers
          </Text>

          {/* Option in Menu */}
          <Flex flexDirection={"column"} mt="5">
            {/* Example of Chakra UI Button */}
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              mb={3}
              bg={ColorSideBar.rSidebar}
              fontSize={"16px"}
              fontWeight={"bold"}
              borderRadius={"12px"}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to={"/customers/customer"}>Customer</NavLink>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              bg={ColorSideBar.rSidebar}
              fontSize={"16px"}
              fontWeight={"bold"}
              borderRadius={"12px"}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to={"/customers/customerprotal"}>
                Customer Portal
              </NavLink>
            </Box>

            {/* Add more Chakra UI Button components as needed */}
          </Flex>
        </Box>

        {/* Projects */}
        <Box
          h="100vh"
          py="8"
          overflowY="auto"
          bg={ColorSideBar.rSidebar}
          borderRight="1px"
          w="60"
          display={showRightSidebar[2] ? "block" : "none"}
          borderColor={"#E2E8E8"}
        >
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform={"uppercase"}
          >
            Projects
          </Text>

          {/* Option in Menu */}
          <Flex flexDirection={"column"} mt="5">
            {/* Example of Chakra UI Button */}
            <Button
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              px="5"
              py="2"
              mb={3}
              bg={ColorSideBar.rSidebar}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <Text w={"full"} textAlign={"left"}>
                Add Project
              </Text>
            </Button>
            <Button
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              px="5"
              py="2"
              bg={ColorSideBar.rSidebar}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <Text w={"full"} textAlign={"left"}>
                Maintenance Agreement
              </Text>
            </Button>

            {/* Add more Chakra UI Button components as needed */}
          </Flex>
        </Box>

        {/* Support Ticket */}
        <Box
          h="100vh"
          py="8"
          overflowY="auto"
          bg={ColorSideBar.rSidebar}
          borderRight="1px"
          w="60"
          display={showRightSidebar[3] ? "block" : "none"}
          borderColor={"#E2E8E8"}
        >
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform={"uppercase"}
          >
            Support Tickets
          </Text>

          {/* Option in Menu */}
          <Flex flexDirection={"column"} mt="5">
            {/* Example of Chakra UI Button */}
            <Button
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              px="5"
              py="2"
              bg={ColorSideBar.rSidebar}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <Text w={"full"} textAlign={"left"}>
                Add Support Ticket
              </Text>
            </Button>

            {/* Add more Chakra UI Button components as needed */}
          </Flex>
        </Box>

        {/* Support Agent */}
        <Box
          h="100vh"
          py="8"
          overflowY="auto"
          bg={ColorSideBar.rSidebar}
          borderRight="1px"
          w="60"
          display={showRightSidebar[4] ? "block" : "none"}
          borderColor={"#E2E8E8"}
        >
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform={"uppercase"}
          >
            Support Agents
          </Text>

          {/* Option in Menu */}
          <Flex flexDirection={"column"} mt="5">
            {/* Example of Chakra UI Button */}
            <Button
              display="flex"
              alignItems="center"
              w="full"
              h={"60px"}
              px="5"
              py="2"
              bg={ColorSideBar.rSidebar}
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <Text w={"full"} textAlign={"left"}>
                Manage Account
              </Text>
            </Button>

            {/* Add more Chakra UI Button components as needed */}
          </Flex>
        </Box>
      </Flex>

      {/* Dashboard Component */}
    </Flex>
  );
};

export default Sidebar;
