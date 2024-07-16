import { useState, ReactNode } from "react";
import { Flex, Box, Button, Text, Image } from "@chakra-ui/react";
import { ColorSideBar, ColorText } from "../templatecolor";

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const initialShowRightSidebar = Array.from({ length: 5 }, () => false); //Config open btn-sidebar

  const [showRightSidebar, setShowRightSidebar] = useState<boolean[]>(
    initialShowRightSidebar
  );

  const toggleRightSidebar = (index: number) => {
    setShowRightSidebar((prev) =>
      prev.map((show, i) => (i === index ? !show : false))
    );
  };

  return (
    <Flex className="flex">
      {/* Left Sidebar */}
      <Flex
        flexDirection="column"
        alignItems="center"
        width="80px"
        height="100vh"
        py="20"
        bg={ColorSideBar.Sidebar}
        // _dark={{ bg: "red.900", border: "red.700" }}
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
            bg={ColorSideBar.Sidebar}
            onClick={() => toggleRightSidebar(0)}
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
            borderRadius={"12px"}
          >
            <Image src="/StaticIcon.png" />
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
            bg={ColorSideBar.Sidebar}
            onClick={() => toggleRightSidebar(1)}
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
            borderRadius={"12px"}
          >
            <Image src="CustomersIcon.png" />
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
            <Image src="ProjectsIcon.png" />
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
            <Image src="SupTicketsIcon.png" />
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
      </Flex>

      {/* Right Sidebar */}
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
          px="5"
          fontSize="20px"
          fontWeight="Bold"
          color={ColorText.BlackText}
          _dark={{ color: "white" }}
          textTransform={"uppercase"}
        >
          Dashboard
        </Text>

        {/* Option in Menu */}
        <Flex w={"100%"} mt="8">
          {/* Example of Chakra UI Button */}
          <Button
            display="flex"
            alignItems="center"
            w="full"
            mx={2}
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          >
            <Text w={"full"} textAlign={"left"}>
              Dashboard
            </Text>
          </Button>

          {/* Add more Chakra UI Button components as needed */}
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
          px="5"
          fontSize="lg"
          fontWeight="medium"
          color={ColorText.BlackText}
          _dark={{ color: "white" }}
          textTransform={"uppercase"}
        >
          Customers
        </Text>

        {/* Option in Menu */}
        <Flex flexDirection={"column"} mt="8">
          {/* Example of Chakra UI Button */}
          <Button
            display="flex"
            alignItems="center"
            w="full"
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          >
            <Text w={"full"} textAlign={"left"}>
              Customer
            </Text>
          </Button>
          <Button
            display="flex"
            alignItems="center"
            w="full"
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          >
            <Text w={"full"} textAlign={"left"}>
              Customer Portal
            </Text>
          </Button>

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
          px="5"
          fontSize="lg"
          fontWeight="medium"
          color={ColorText.BlackText}
          _dark={{ color: "white" }}
          textTransform={"uppercase"}
        >
          Projects
        </Text>

        {/* Option in Menu */}
        <Flex flexDirection={"column"} mt="8">
          {/* Example of Chakra UI Button */}
          <Button
            display="flex"
            alignItems="center"
            w="full"
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
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
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
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
          px="5"
          fontSize="lg"
          fontWeight="medium"
          color={ColorText.BlackText}
          _dark={{ color: "white" }}
          textTransform={"uppercase"}
        >
          Support Tickets
        </Text>

        {/* Option in Menu */}
        <Flex flexDirection={"column"} mt="8">
          {/* Example of Chakra UI Button */}
          <Button
            display="flex"
            alignItems="center"
            w="full"
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          >
            <Text w={"full"} textAlign={"left"}>
              Add Support Ticket
            </Text>
          </Button>
          <Button
            display="flex"
            alignItems="center"
            w="full"
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          >
            <Text w={"full"} textAlign={"left"}>
              Customer Portal
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
          px="5"
          fontSize="lg"
          fontWeight="medium"
          color={ColorText.BlackText}
          _dark={{ color: "white" }}
          textTransform={"uppercase"}
        >
          Support Tickets
        </Text>

        {/* Option in Menu */}
        <Flex flexDirection={"column"} mt="8">
          {/* Example of Chakra UI Button */}
          <Button
            display="flex"
            alignItems="center"
            w="full"
            h={"60px"}
            px="5"
            py="2"
            _hover={{ bg: ColorSideBar.BtnSideBarHover }}
          >
            <Text w={"full"} textAlign={"left"}>
              Manage account
            </Text>
          </Button>

          {/* Add more Chakra UI Button components as needed */}
        </Flex>
        {/* SUPPORT AGENT */}
      </Box>
    </Flex>
  );
};

export default Sidebar;
