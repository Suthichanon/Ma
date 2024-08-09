import { useState, ReactNode } from "react";
import {
  Flex,
  Box,
  Button,
  Text,
  Image,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ColorSideBar, ColorText } from "../templatecolor";
import { NavLink, useLocation } from "react-router-dom";
import Logout from "../Auth/Logout";
import "./Sidebar.css";

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const isDrawer = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isRightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);

  const initialShowRightSidebar = Array.from({ length: 5 }, () => false);

  const [showRightSidebar, setShowRightSidebar] = useState<boolean[]>(
    initialShowRightSidebar
  );
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const toggleRightSidebar = (index: number) => {
    const newShowRightSidebar = showRightSidebar.map((show, i) =>
      i === index ? !show : false
    );
    setShowRightSidebar(newShowRightSidebar);

    if (newShowRightSidebar.includes(true)) {
      setRightSidebarOpen(true); // เปิด RightSidebar เมื่อมีเมนูใดๆ ที่ต้องแสดง
    } else {
      setRightSidebarOpen(false); // ซ่อน RightSidebar เมื่อไม่มีเมนูที่ต้องแสดง
    }

    if (index === 0) {
      setShowDashboard(!showDashboard);
    } else {
      setShowDashboard(false);
    }
  };

  const myLocation = location.pathname.split("/");

  const SidebarContent = () => (
    <Flex direction="column" py="20" bg={ColorSideBar.Sidebar}>
      {/* DashBoard Menu */}
      <Flex
        w="100%"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        mb={8}
      >
        <Button
          h="65px"
          py={0}
          bg={
            location.pathname === "/dashboard"
              ? ColorSideBar.BtnSideBarHover
              : ColorSideBar.Sidebar
          }
          onClick={() => toggleRightSidebar(0)}
          _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          borderRadius="12px"
        >
          <NavLink to="/dashboard" style={{ padding: 0 }}>
            <Image src="/dashboard.png" />
          </NavLink>
        </Button>
      </Flex>

      {/* Customer Menu */}
      <Flex
        w="100%"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        mb={8}
      >
        <Button
          h="65px"
          py={0}
          bg={
            myLocation[1] === "customers"
              ? ColorSideBar.BtnSideBarHover
              : ColorSideBar.Sidebar
          }
          onClick={() => toggleRightSidebar(1)}
          _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          borderRadius="12px"
        >
          <NavLink to="/customers/customer" style={{ padding: 0 }}>
            <Image src="/customer.png" />
          </NavLink>
        </Button>
      </Flex>

      {/* Projects Menu */}
      <Flex
        w="100%"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        mb={8}
      >
        <Button
          h="65px"
          py={0}
          bg={
            myLocation[1] === "projects"
              ? ColorSideBar.BtnSideBarHover
              : ColorSideBar.Sidebar
          }
          onClick={() => toggleRightSidebar(2)}
          _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          borderRadius="12px"
        >
          <NavLink to="/projects/project" style={{ padding: 0 }}>
            <Image src="/project.png" />
          </NavLink>
        </Button>
      </Flex>

      {/* Support Tickets Menu */}
      <Flex
        w="100%"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        mb={8}
      >
        <Button
          h="65px"
          py={0}
          bg={
            myLocation[1] === "support"
              ? ColorSideBar.BtnSideBarHover
              : ColorSideBar.Sidebar
          }
          onClick={() => toggleRightSidebar(3)}
          _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          borderRadius="12px"
        >
          <NavLink to="/support/ticket" style={{ padding: 0 }}>
            <Image src="/ticket.png" />
          </NavLink>
        </Button>
      </Flex>

      {/* Support Agent Menu */}
      <Flex
        w="100%"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        mb={8}
      >
        <Button
          h="65px"
          py={0}
          bg={
            myLocation[1] === "user"
              ? ColorSideBar.BtnSideBarHover
              : ColorSideBar.Sidebar
          }
          onClick={() => toggleRightSidebar(4)}
          _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          borderRadius="12px"
        >
          <NavLink to="/user/manageacc" style={{ padding: 0 }}>
            <Image src="/manage.png" />
          </NavLink>
        </Button>
      </Flex>
      <Box>
        <Logout />
      </Box>
    </Flex>
  );

  const RightSidebarContent = () => (
    <Flex
      direction="column"
      py="8"
      bg={ColorSideBar.rSidebar}
      height="100%"
      w={isRightSidebarOpen ? "60" : "0"}
      display={isRightSidebarOpen ? "flex" : "none"}
      transition="width 0.2s"
      borderRight={`1px solid #d9d9d9}`}
    >
      {showRightSidebar[0] && (
        <Box>
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform="uppercase"
          >
            Dashboard
          </Text>
          <Flex flexDirection={'column'} ml={1} mr={1} mt="5" >
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
              onClick={() => setShowDashboard(!showDashboard)}
            >
              <NavLink to="/dashboard">Dashboard</NavLink>
            </Box>
          </Flex>
        </Box>
      )}

      {showRightSidebar[1] && (
        <Box>
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform="uppercase"
          >
            Customers
          </Text>
          <Flex flexDirection="column" ml={1} mr={1} mt="5" >
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              mb={3}
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to="/customers/customer">Customer</NavLink>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to="/customers/customerprotal">Customer Portal</NavLink>
            </Box>
          </Flex>
        </Box>
      )}

      {showRightSidebar[2] && (
        <Box>
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform="uppercase"
          >
            Projects
          </Text>
          <Flex flexDirection="column" ml={1} mr={1} mt="5">
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              mb={3}
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to="projects/project">Add Project</NavLink>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to="/projects/projectma">Maintenance Agreement</NavLink>
            </Box>
          </Flex>
        </Box>
      )}

      {showRightSidebar[3] && (
        <Box>
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform="uppercase"
          >
            Support Tickets
          </Text>
          <Flex flexDirection="column" ml={1} mr={1} mt="5">
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to="/support/ticket">Add Support Ticket</NavLink>
            </Box>
          </Flex>
        </Box>
      )}

      {showRightSidebar[4] && (
        <Box>
          <Text
            px="3"
            fontSize="20px"
            fontWeight="Bold"
            color={ColorText.BlackText}
            _dark={{ color: "white" }}
            textTransform="uppercase"
          >
            Support Agents
          </Text>
          <Flex flexDirection="column" ml={1} mr={1} mt="5">
            <Box
              display="flex"
              alignItems="center"
              w="full"
              h="60px"
              bg={ColorSideBar.rSidebar}
              fontSize="16px"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{
                bg: ColorSideBar.BtnSideBarHover,
                color: ColorText.WhiteText,
              }}
            >
              <NavLink to="/user/manageacc">Manage Account</NavLink>
            </Box>
          </Flex>
        </Box>
      )}
      <Box position={"absolute"} bottom={10} left={"112px"}>
        <Text mb={2} textAlign={"center"}>
          Powered By
        </Text>
        <Box w={"100%"}>
          <Image src="/Lucas.png" alt="LogoLucus" />
        </Box>
      </Box>
    </Flex>
  );

  return (
    <Flex direction={{ base: "column", lg: "row" }}>
      {isDrawer ? (
        <>
          <Button onClick={onOpen}>Open Sidebar</Button>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody p={0}>
                  <Flex direction="row" height="100%">
                    <SidebarContent />
                    {isRightSidebarOpen && <RightSidebarContent />}
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : (
        <>
          <SidebarContent />
          {isRightSidebarOpen && <RightSidebarContent />}
        </>
      )}
    </Flex>
  );
};

export default Sidebar;
