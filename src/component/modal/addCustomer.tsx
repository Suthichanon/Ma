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
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Radio,
  Textarea,
  HStack,
  Box,
  RadioGroup,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaPlusSquare } from "react-icons/fa";
import { ColorBtn } from "../templatecolor";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase/firebaseAuth";
import { collection, addDoc } from "firebase/firestore";

interface CustomerModalProps {
  addCustomer: (newCustomer: Customer) => void;
}

interface Customer {
  customerName: string;
  taxIdOrIdCard: string;
  contactName: string;
  mobile: string;
  email: string;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ addCustomer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customerType, setCustomerType] = useState("corporation");
  const [branchType, setBranchType] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    customerName: "",
    taxId: "",
    idCard: "",
    address: "",
    zipCode: "",
    phone: "",
    fax: "",
    website: "",
    contactName: "",
    mobile: "",
    contactEmail: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    customerName: "",
    taxId: "",
    idCard: "",
    address: "",
    zipCode: "",
    phone: "",
    fax: "",
    website: "",
    contactName: "",
    mobile: "",
    contactEmail: "",
    branchType: "",
  });

  const handleCustomerTypeChange = (value: string) => {
    setCustomerType(value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateTaxId = (taxId: string) => {
    return taxId.length === 10 || taxId.length === 13;
  };

  const validateIdCard = (idCard: string) => {
    return idCard.length === 13;
  };

  const handleSave = async () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      customerName: "",
      taxId: "",
      idCard: "",
      address: "",
      zipCode: "",
      phone: "",
      fax: "",
      website: "",
      contactName: "",
      mobile: "",
      contactEmail: "",
      branchType: "",
    };

    if (!formData.username) {
      newErrors.username = "Please enter a username.";
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "Username can only contain letters and numbers.";
    }

    if (!formData.email) {
      newErrors.email = "Please enter an email.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter a password.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!formData.customerName) {
      newErrors.customerName = "Please enter a customer name.";
    }

    if (customerType === "corporation") {
      if (!formData.taxId) {
        newErrors.taxId = "Please enter a tax ID.";
      } else if (!validateTaxId(formData.taxId)) {
        newErrors.taxId = "Tax ID must be either 10 or 13 characters long.";
      }

      if (!branchType) {
        newErrors.branchType = "Please select a branch type.";
      }
    }

    if (customerType === "individual") {
      if (!formData.idCard) {
        newErrors.idCard = "Please enter an ID card.";
      } else if (!validateIdCard(formData.idCard)) {
        newErrors.idCard = "ID Card must be 13 characters long.";
      }
    }

    if (!formData.address) {
      newErrors.address = "Please enter an address.";
    }

    if (!formData.contactName) {
      newErrors.contactName = "Please enter a contact name.";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Please enter a mobile number.";
    }

    if (!formData.contactEmail) {
      newErrors.contactEmail = "Please enter a contact email.";
    }

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => !error);

    if (isValid) {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const newCustomer: Customer = {
          customerName: formData.customerName,
          taxIdOrIdCard:
            customerType === "corporation" ? formData.taxId : formData.idCard,
          contactName: formData.contactName,
          mobile: formData.mobile,
          email: formData.contactEmail,
        };

        await addDoc(collection(db, "customers"), newCustomer);
        addCustomer(newCustomer);
        onClose();
      } catch (error) {
        console.error("Error creating user:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Error creating user. Please try again.",
        }));
      }
    }
  };

  return (
    <Box>
      <Button
        onClick={onOpen}
        leftIcon={<FaPlusSquare />}
        colorScheme="red"
        variant="solid"
        size="lg"
        bg={ColorBtn.AddBtnBg}
      >
        Add Customer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" color={ColorBtn.UpBtnBg}>
            ADD CUSTOMER
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
                  bg={customerType === "corporation" ? "white" : "transparent"}
                  onClick={() => handleCustomerTypeChange("corporation")}
                  borderRadius="md"
                  zIndex={1}
                  position="relative"
                >
                  Corporation
                </Button>
                <Button
                  flex="1"
                  bg={customerType === "individual" ? "white" : "transparent"}
                  onClick={() => handleCustomerTypeChange("individual")}
                  borderRadius="md"
                  zIndex={1}
                  position="relative"
                >
                  Individual
                </Button>
                <Box
                  position="absolute"
                  top="1"
                  bottom="1"
                  left={customerType === "corporation" ? "0" : "49%"}
                  width="50%"
                  bg="#ffffff"
                  borderRadius="md"
                  transition="left 0.5s ease"
                  zIndex={0}
                />
              </Box>
            </Box>

            {customerType === "corporation" ? (
              <>
                <SectionHeader title="CUSTOMER ACCOUNT" />
                <FormControl isRequired isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    placeholder="Username"
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  )}
                </FormControl>

                <SectionHeader title="CUSTOMER INFORMATION" />
                <FormControl isRequired isInvalid={!!errors.customerName}>
                  <FormLabel>Customer Name</FormLabel>
                  <Input
                    name="customerName"
                    placeholder="Customer Name"
                    onChange={handleInputChange}
                  />
                  {errors.customerName && (
                    <FormErrorMessage>{errors.customerName}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.taxId}>
                  <FormLabel>Tax ID</FormLabel>
                  <Input
                    name="taxId"
                    placeholder="Tax ID"
                    onChange={handleInputChange}
                  />
                  {errors.taxId && (
                    <FormErrorMessage>{errors.taxId}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.branchType}>
                  <FormLabel>Branch</FormLabel>
                  <RadioGroup onChange={setBranchType} value={branchType}>
                    <HStack>
                      <Radio value="head-office" colorScheme="gray">
                        Head Office
                      </Radio>
                      <Radio value="branch" colorScheme="gray">
                        Branch
                      </Radio>
                    </HStack>
                  </RadioGroup>
                  {errors.branchType && (
                    <FormErrorMessage>{errors.branchType}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.address}>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    name="address"
                    placeholder="Address"
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Zip Code</FormLabel>
                  <Input
                    name="zipCode"
                    placeholder="Zip Code"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    placeholder="Phone"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Fax</FormLabel>
                  <Input
                    name="fax"
                    placeholder="Fax"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Website</FormLabel>
                  <Input
                    name="website"
                    placeholder="Website"
                    onChange={handleInputChange}
                  />
                </FormControl>

                <SectionHeader title="CONTACT PERSON" />
                <FormControl isRequired isInvalid={!!errors.contactName}>
                  <FormLabel>Contact Name</FormLabel>
                  <Input
                    name="contactName"
                    placeholder="Contact Name"
                    onChange={handleInputChange}
                  />
                  {errors.contactName && (
                    <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.mobile}>
                  <FormLabel>Mobile</FormLabel>
                  <Input
                    name="mobile"
                    placeholder="Mobile"
                    onChange={handleInputChange}
                  />
                  {errors.mobile && (
                    <FormErrorMessage>{errors.mobile}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isRequired
                  mt={4}
                  isInvalid={!!errors.contactEmail}
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="contactEmail"
                    placeholder="Email"
                    onChange={handleInputChange}
                  />
                  {errors.contactEmail && (
                    <FormErrorMessage>{errors.contactEmail}</FormErrorMessage>
                  )}
                </FormControl>
              </>
            ) : (
              <>
                <SectionHeader title="CUSTOMER ACCOUNT" />
                <FormControl isRequired isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    placeholder="Username"
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  )}
                </FormControl>

                <SectionHeader title="CUSTOMER INFORMATION" />
                <FormControl isRequired isInvalid={!!errors.customerName}>
                  <FormLabel>Customer Name</FormLabel>
                  <Input
                    name="customerName"
                    placeholder="Customer Name"
                    onChange={handleInputChange}
                  />
                  {errors.customerName && (
                    <FormErrorMessage>{errors.customerName}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.idCard}>
                  <FormLabel>ID Card</FormLabel>
                  <Input
                    name="idCard"
                    placeholder="ID Card"
                    onChange={handleInputChange}
                  />
                  {errors.idCard && (
                    <FormErrorMessage>{errors.idCard}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.address}>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    name="address"
                    placeholder="Address"
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Zip Code</FormLabel>
                  <Input
                    name="zipCode"
                    placeholder="Zip Code"
                    onChange={handleInputChange}
                  />
                </FormControl>

                <SectionHeader title="CONTACT PERSON" />
                <FormControl isRequired isInvalid={!!errors.contactName}>
                  <FormLabel>Contact Name</FormLabel>
                  <Input
                    name="contactName"
                    placeholder="Contact Name"
                    onChange={handleInputChange}
                  />
                  {errors.contactName && (
                    <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired mt={4} isInvalid={!!errors.mobile}>
                  <FormLabel>Mobile</FormLabel>
                  <Input
                    name="mobile"
                    placeholder="Mobile"
                    onChange={handleInputChange}
                  />
                  {errors.mobile && (
                    <FormErrorMessage>{errors.mobile}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isRequired
                  mt={4}
                  isInvalid={!!errors.contactEmail}
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="contactEmail"
                    placeholder="Email"
                    onChange={handleInputChange}
                  />
                  {errors.contactEmail && (
                    <FormErrorMessage>{errors.contactEmail}</FormErrorMessage>
                  )}
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Box w={"100%"} display={"flex"} justifyContent={"center"}>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                bg={ColorBtn.AddBtnBg}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <FormLabel mt={8} mb={2} fontSize="lg" fontWeight="bold" textAlign="center">
    {title}
  </FormLabel>
);

export default CustomerModal;
