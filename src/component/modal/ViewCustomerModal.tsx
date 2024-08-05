import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  Textarea,
  HStack,
  Box,
  RadioGroup,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ColorBtn } from "../templatecolor";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"; // Import icons

interface ViewCustomerModalProps {
  customer?: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Customer {
  id?: string;
  username: string;
  email: string;
  password: string;
  customerName: string;
  taxIdOrIdCard: string;
  idCard: string;
  address: string;
  zipCode: string;
  phone: string;
  fax: string;
  website: string;
  contactName: string;
  mobile: string;
  contactEmail: string;
  customerType: string;
  branchType: string;
}

const ViewCustomerModal: React.FC<ViewCustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false); // state to toggle password visibility

  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" color={ColorBtn.UpBtnBg}>
          View Customer
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" justifyContent="center" mb={4}>
            <Box
              display="flex"
              bg="#d9d9d9"
              borderRadius="md"
              p={1}
              w="350px"
              position="relative"
            >
              <Button
                flex="1"
                bg={
                  customer.customerType === "corporation"
                    ? "white"
                    : "transparent"
                }
                borderRadius="md"
                zIndex={1}
                position="relative"
                isDisabled
              >
                Corporation
              </Button>
              <Button
                flex="1"
                bg={
                  customer.customerType === "individual"
                    ? "white"
                    : "transparent"
                }
                borderRadius="md"
                zIndex={1}
                position="relative"
                isDisabled
              >
                Individual
              </Button>
              <Box
                position="absolute"
                top="1"
                bottom="1"
                left={customer.customerType === "corporation" ? "0" : "49%"}
                width="50%"
                bg="#ffffff"
                borderRadius="md"
                transition="left 0.5s ease"
                zIndex={0}
              />
            </Box>
          </Box>

          <SectionHeader title="CUSTOMER ACCOUNT" />
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              placeholder="Username"
              value={customer.username}
              isReadOnly
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              placeholder="Email"
              value={customer.email}
              isReadOnly
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={customer.password}
                isReadOnly
              />
              <InputRightElement>
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <SectionHeader title="CUSTOMER INFORMATION" />
          <FormControl isRequired>
            <FormLabel>Customer Name</FormLabel>
            <Input
              name="customerName"
              placeholder="Customer Name"
              value={customer.customerName}
              isReadOnly
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>
              {customer.customerType === "corporation" ? "Tax ID" : "ID Card"}
            </FormLabel>
            <Input
              name="taxIdOrIdCard"
              placeholder={
                customer.customerType === "corporation" ? "Tax ID" : "ID Card"
              }
              value={
                customer.customerType === "corporation"
                  ? customer.taxIdOrIdCard
                  : customer.idCard
              }
              isReadOnly
            />
          </FormControl>
          {customer.customerType === "corporation" && (
            <FormControl isRequired mt={4}>
              <FormLabel>Branch</FormLabel>
              <RadioGroup value={customer.branchType}>
                <HStack>
                  <Radio value="head-office" isDisabled>
                    Head Office
                  </Radio>
                  <Radio value="branch" isDisabled>
                    Branch
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          )}
          <FormControl isRequired mt={4}>
            <FormLabel>Address</FormLabel>
            <Textarea
              name="address"
              placeholder="Address"
              value={customer.address}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Zip Code</FormLabel>
            <Input
              name="zipCode"
              placeholder="Zip Code"
              value={customer.zipCode}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              placeholder="Phone"
              value={customer.phone}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Fax</FormLabel>
            <Input
              name="fax"
              placeholder="Fax"
              value={customer.fax}
              isReadOnly
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Website</FormLabel>
            <Input
              name="website"
              placeholder="Website"
              value={customer.website}
              isReadOnly
            />
          </FormControl>

          <SectionHeader title="CONTACT PERSON" />
          <FormControl isRequired>
            <FormLabel>Contact Name</FormLabel>
            <Input
              name="contactName"
              placeholder="Contact Name"
              value={customer.contactName}
              isReadOnly
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Mobile</FormLabel>
            <Input
              name="mobile"
              placeholder="Mobile"
              value={customer.mobile}
              isReadOnly
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Contact Email</FormLabel>
            <Input
              name="contactEmail"
              placeholder="Contact Email"
              value={customer.contactEmail}
              isReadOnly
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Box w={"100%"} display={"flex"} justifyContent={"center"}>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <FormLabel mt={8} mb={2} fontSize="lg" fontWeight="bold" textAlign="center">
    {title}
  </FormLabel>
);

export default ViewCustomerModal;
