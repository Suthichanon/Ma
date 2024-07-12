import React, { useState } from "react";
import { auth } from "../../firebase/firebaseAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard  "); // handle successful signIn (e.g., redirect to dashboard page)
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError("Email or Password is wrong!");
        console.log(email, password);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Redirect to forgot password page
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      height="100vh"
    >
      <Box>
        <Image
          src="/MaLogo.png"
          alt="MaLogo"
          w={{
            base: "125px",
            sm: "150px",
            md: "175px",
            lg: "200px",
            xl: "250px",
            "2xl": "250px",
          }}
          minW={{
            base: "125px",
            sm: "150px",
            md: "175px",
            lg: "200px",
            xl: "250px",
            "2xl": "250px",
          }}
        />
        <Text textTransform={"uppercase"}>MAinTEnance Service agreement</Text>
      </Box>
      <Box
        width="md"
        height={"lg"}
        p={6}
        borderWidth={1}
        borderRadius={20}
        boxShadow="lg"
      >
        <Heading as="h1" size="lg" textAlign="left" mb={6}>
          Sign In
        </Heading>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"}>
              <Text
                color="red.500"
                textAlign="right"
                cursor="pointer"
                onClick={handleForgotPassword}
                _hover={{
                  textDecoration: "underline",
                  textDecorationColor: "red.500",
                }}
              >
                Forgot Password?
              </Text>
            </Box>
            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              colorScheme="teal"
              bgColor={"black"}
              color={"white"}
              width="full"
            >
              Sign In
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default SignIn;
