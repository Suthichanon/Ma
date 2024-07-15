import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
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

const App: React.FC = () => {
  return (
    <ChakraProvider>
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
                <Sidebar />
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
