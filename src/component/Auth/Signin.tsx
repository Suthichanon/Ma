import React, { useState } from "react";
import { auth } from "../../firebase/firebaseAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Image,
  useToast,
  Flex,
} from "@chakra-ui/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Authentication error",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      height={{ base: "100vh", md: "100vh", lg: "100vh", xl: "100vh" }}
    >
      <Flex
        flexDirection={"column"}
        w={"100%"}
        h={"100%"}
        alignItems={"center"}
      >
        <VStack
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignContent={"center"}
          pb={{ base: 5, lg: 10 }}
          alignItems={"center"}
          w={"100%"}
          h={"100%"}
          mt={{ base: 10, sm: 0 }}
        >
          <Image
            src="/MaLogo.png"
            alt="MaLogo"
            w={{
              base: "100px",
              sm: "100px",
              // md: "px",
              // lg: "px",
              // xl: "px",
              // "2xl": "px",
            }}
            // minW={{
            //   base: "125px",
            //   sm: "px",
            //   md: "px",
            //   lg: "px",
            //   xl: "px",
            //   "2xl": "px",
            // }}
            h={{ base: "100px", sm: "100px" }}
            mb={5}
          />
          <Text
            textAlign={"center"}
            fontWeight={500}
            fontSize={24}
            textTransform={"uppercase"}
          >
            MAinTEnance Service agreement
          </Text>
        </VStack>

        <VStack
          as="form"
          onSubmit={handleSignIn}
          spacing={4}
          px={{ base: 4, sm: 8, md: 8, lg: 14, xl: 16, "2xl": 18 }}
          py={{ base: 4, sm: 8, md: 8, lg: 14, xl: 16, "2xl": 18 }}
          borderWidth={1}
          borderRadius="24px"
          boxShadow="lg"
          w={{
            base: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "50%",
            "2xl": "20%",
          }}
          minW={{
            base: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "50%",
            "2xl": "25%",
          }}
        >
          <Text
            w={"100%"}
            textAlign={"left"}
            fontWeight={700}
            fontSize={36}
            mt={10}
            mb={5}
          >
            Sign In
          </Text>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Box display={"flex"} w={"100%"} justifyContent={"end"}>
            <Text
              w={"100%"}
              cursor="pointer"
              color="red"
              textAlign={"right"}
              _hover={{ color: "red", textDecoration: "underline" }}
              onClick={() => navigate("/forgot-password")}
              fontWeight={600}
            >
              Forgot Password?
            </Text>
          </Box>
          <Button
            type="submit"
            bgColor={"#080808"}
            colorScheme="red"
            width="full"
          >
            Sign In
          </Button>
        </VStack>

        <VStack w={"100%"} py={{ base: 10, md: 15 }}>
          <Text textAlign={"center"}>Powered By</Text>
          <Image src="/Lucas.png" alt="Logo lucas"></Image>
        </VStack>
      </Flex>
    </Box>
  );
};

export default SignIn;
