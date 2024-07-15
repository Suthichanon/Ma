import React, { useState } from "react";
import { Flex, Box, Image, Button, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Sidebar = () => {
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  return (
    <Flex as="aside" className="flex">
      {/* Left Sidebar */}
      <Flex 
        flexDirection="column"
        alignItems="center"
        width="16"
        height="100vh"
        py="8"
        bg="#FC0A18"
        _dark={{ bg: "gray.900", border: "gray.700" }}
      >
        {/* Example Chakra UI Button */}
        <Button
          p="1.5"
          color="gray.500"
          _hover={{ bg: "gray.100" }}
          _dark={{ color: "gray.400", _hover: { bg: "gray.800" } }}
          onClick={toggleRightSidebar}
        >
          <ExternalLinkIcon w="6" h="6" />
        </Button>
        {/* Add more buttons as needed */}
      </Flex>

      {/* Right Sidebar */}
      <Box
        h="100vh"
        py="8"
        overflowY="auto"
        bg="white"
        // borderLeft="1px"
        borderRight="1px"
        w="60"
        display={showRightSidebar ? "block" : "none"}
        borderColor={'#E2E8E8'}
      >
        <Text
          px="5"
          fontSize="lg"
          fontWeight="medium"
          color="gray.800"
          _dark={{ color: "white" }}
        >
          Accounts
        </Text>

        {/* Example of Chakra UI Button Group */}
        <Box mt="8">
          {/* Example of Chakra UI Button */}
          <Button
            display="flex"
            alignItems="center"
            w="full"
            px="5"
            py="2"
            _hover={{ bg: "gray.100" }}
          >
            <Image
              src="https://example.com/profile-image.jpg"
              alt=""
              w="8"
              h="8"
              borderRadius="full"
              objectFit="cover"
            />

            <Box ml="2">
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                textTransform="capitalize"
                _dark={{ color: "white" }}
              >
                Mia John
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                11.2 Followers
              </Text>
            </Box>
          </Button>

          {/* Add more Chakra UI Button components as needed */}
        </Box>
      </Box>
    </Flex>
  );
};

export default Sidebar;
