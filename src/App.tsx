import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import SigninWithRedirect from "./component/Auth/SigninWithRedirect";
import SignupWithRedirect from "./component/Auth/SignupWithRedirect";
import ForgotPasswordWithRedirect from "./component/Auth/ForgotPasswordWithRedirect";
import PrivateRoute from "./component/Auth/PrivateRoute";
import Layout from "./component/Sidebar/Layout";
import Customer from "./pages/Customer";
import CustomerProtal from "./pages/CustomerProtal";
import AddProjects from "./pages/AddProjects";
import MaPage from "./pages/MaPage";
import SupportTicket from "./pages/AddSupTick";
import UserManageAcc from "./pages/ManagerAccount";
const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SigninWithRedirect />} />
          <Route path="/signup" element={<SignupWithRedirect />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordWithRedirect />}
          />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/customers/customer" element={<Customer />} />
              <Route
                path="/customers/customerprotal"
                element={<CustomerProtal />}
              ></Route>
              <Route path="/projects/project" element={<AddProjects />}></Route>
              <Route path="/projects/projectma" element={<MaPage />}></Route>
              <Route path="/support/ticket" element={<SupportTicket/>} />
              <Route path="/user/manageacc" element={<UserManageAcc/>}></Route>
            </Route>
          </Route>
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
