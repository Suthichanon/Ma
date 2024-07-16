import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import SigninPage from "./pages/Signin";
// import SignupPage from "./pages/Signup";
import PrivateRoute from "./component/Auth/PrivateRoute";
import DashboardPage from "./pages/Dashboard";
import SigninWithRedirect from "./component/Auth/SigninWithRedirect";
import SignupWithRedirect from "./component/Auth/SignupWithRedirect";
import ForgotPasswordWithRedirect from "./component/Auth/ForgotPasswordWithRedirect";
import Sidebar from "./component/Sidebar/SideBar";
import { Flex } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SigninWithRedirect />} />
          <Route path="/signup" element={<SignupWithRedirect />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordWithRedirect />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Flex>
                  <Sidebar />
                  <DashboardPage />
                </Flex>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
