import React, { useState, useEffect } from "react";
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
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { db } from "../../firebase/firebaseAuth";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { ColorBtn } from "../templatecolor";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface CustomerModalProps {
  addCustomer: (newCustomer: Customer) => void;
  updateCustomer: (updatedCustomer: Customer) => void;
  customer?: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Customer {
  id?: string;
  customerId?: string;
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

const CustomerModal: React.FC<CustomerModalProps> = ({
  addCustomer,
  updateCustomer,
  customer,
  isOpen,
  onClose,
}) => {
  const [customerType, setCustomerType] = useState("corporation");
  const [branchType, setBranchType] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [formData, setFormData] = useState<Customer>({
    username: "",
    email: "",
    password: "",
    customerName: "",
    taxIdOrIdCard: "",
    idCard: "",
    address: "",
    zipCode: "",
    phone: "",
    fax: "",
    website: "",
    contactName: "",
    mobile: "",
    contactEmail: "",
    customerType: "corporation",
    branchType: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    customerName: "",
    taxIdOrIdCard: "",
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

  useEffect(() => {
    if (customer) {
      setFormData(customer);
      setCustomerType(customer.customerType);
      setBranchType(customer.branchType);
    } else {
      resetForm();
    }
  }, [customer, isOpen]);

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      customerName: "",
      taxIdOrIdCard: "",
      idCard: "",
      address: "",
      zipCode: "",
      phone: "",
      fax: "",
      website: "",
      contactName: "",
      mobile: "",
      contactEmail: "",
      customerType: "corporation",
      branchType: "",
    });
    setCustomerType("corporation");
    setBranchType("");
  };

  const handleCustomerTypeChange = (value: string) => {
    setCustomerType(value);
    setBranchType(""); // Reset branchType when customer type changes
  };

  const handleBranchTypeChange = (value: string) => {
    setBranchType(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      branchType: "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
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

  const getLastCustomerId = async (): Promise<string | null> => {
    const customersCollection = collection(db, "customers");
    const customersQuery = query(
      customersCollection,
      orderBy("customerId", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(customersQuery);

    if (!querySnapshot.empty) {
      const lastCustomer = querySnapshot.docs[0].data() as Customer;
      return lastCustomer.customerId || null;
    }
    return null;
  };

  const generateNewCustomerId = (lastCustomerId: string | null): string => {
    if (!lastCustomerId) {
      return "CU000001";
    }

    const numericPart = parseInt(lastCustomerId.replace("CU", ""), 10);
    const newNumericPart = numericPart + 1;
    return `CU${newNumericPart.toString().padStart(6, "0")}`;
  };

  const handleSave = async () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      customerName: "",
      taxIdOrIdCard: "",
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
      if (!formData.taxIdOrIdCard) {
        newErrors.taxIdOrIdCard = "Please enter a tax ID.";
      } else if (!validateTaxId(formData.taxIdOrIdCard)) {
        newErrors.taxIdOrIdCard =
          "Tax ID must be either 10 or 13 characters long.";
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
      const auth = getAuth();
      try {
        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          formData.email
        );
        if (signInMethods.length === 0 && !customer) {
          // User does not exist and it's a new customer, create a new user
          await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
        }

        const newCustomer: Customer = {
          ...formData,
          customerType,
          branchType,
        };

        if (!customer) {
          const lastCustomerId = await getLastCustomerId();
          newCustomer.customerId = generateNewCustomerId(lastCustomerId);
        }

        const customerData = {
          ...newCustomer,
        };

        if (customer && customer.id) {
          // Update existing customer, don't change customerId
          await updateDoc(doc(db, "customers", customer.id), customerData);
          updateCustomer(newCustomer);
        } else {
          // Add new customer
          const docRef = await addDoc(
            collection(db, "customers"),
            customerData
          );
          newCustomer.id = docRef.id;
          addCustomer(newCustomer);
        }

        onClose();
        resetForm(); // รีเซ็ทฟอร์มหลังจากบันทึกข้อมูลเสร็จ
      } catch (error) {
        console.error("Error creating or checking user:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Error creating or checking user. Please try again.",
        }));
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" color={ColorBtn.UpBtnBg}>
          {customer ? "Edit Customer" : "Add Customer"}
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
              overflow="hidden"
            >
              <Button
                flex="1"
                bg={customerType === "corporation" ? "white" : "transparent"}
                onClick={() => handleCustomerTypeChange("corporation")}
                borderRadius="md"
                zIndex={1}
                position="relative"
                boxShadow={
                  customerType === "corporation" ? "0 0 0 1px white" : "none"
                }
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
                boxShadow={
                  customerType === "individual" ? "0 0 0 1px white" : "none"
                }
              >
                Individual
              </Button>
              <Box
                position="absolute"
                top="1"
                bottom="1"
                left={customerType === "corporation" ? "2%" : "50%"}
                width="40%"
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
                  value={formData.username}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  isReadOnly={!!customer}
                  bg={customer ? "gray.100" : "white"}
                  pointerEvents={customer ? "none" : "auto"} // Apply color to indicate read-only
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={4} isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isReadOnly={!!customer}
                    bg={customer ? "gray.100" : "white"} // Apply color to indicate read-only
                    pointerEvents={customer ? "none" : "auto"}
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
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
                {errors.customerName && (
                  <FormErrorMessage>{errors.customerName}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={4} isInvalid={!!errors.taxIdOrIdCard}>
                <FormLabel>Tax ID</FormLabel>
                <Input
                  name="taxIdOrIdCard"
                  placeholder="Tax ID"
                  value={formData.taxIdOrIdCard}
                  onChange={handleInputChange}
                />
                {errors.taxIdOrIdCard && (
                  <FormErrorMessage>{errors.taxIdOrIdCard}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={4} isInvalid={!!errors.branchType}>
                <FormLabel>Branch</FormLabel>
                <RadioGroup
                  onChange={handleBranchTypeChange}
                  value={branchType}
                >
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
                  value={formData.address}
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
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Fax</FormLabel>
                <Input
                  name="fax"
                  placeholder="Fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Website</FormLabel>
                <Input
                  name="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </FormControl>

              <SectionHeader title="CONTACT PERSON" />
              <FormControl isRequired isInvalid={!!errors.contactName}>
                <FormLabel>Contact Name</FormLabel>
                <Input
                  name="contactName"
                  placeholder="Contact Name"
                  value={formData.contactName}
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
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
                {errors.mobile && (
                  <FormErrorMessage>{errors.mobile}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={4} isInvalid={!!errors.contactEmail}>
                <FormLabel>Contact Email</FormLabel>
                <Input
                  name="contactEmail"
                  placeholder="Contact Email"
                  value={formData.contactEmail}
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
                  value={formData.username}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  isReadOnly={!!customer}
                  bg={customer ? "gray.100" : "white"}
                  pointerEvents={customer ? "none" : "auto"} // Apply color to indicate read-only
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={4} isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isReadOnly={!!customer}
                    bg={customer ? "gray.100" : "white"} // Apply color to indicate read-only
                    pointerEvents={customer ? "none" : "auto"}
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
                  value={formData.customerName}
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
                  value={formData.idCard}
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
                  value={formData.address}
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
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </FormControl>

              <SectionHeader title="CONTACT PERSON" />
              <FormControl isRequired isInvalid={!!errors.contactName}>
                <FormLabel>Contact Name</FormLabel>
                <Input
                  name="contactName"
                  placeholder="Contact Name"
                  value={formData.contactName}
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
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
                {errors.mobile && (
                  <FormErrorMessage>{errors.mobile}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired mt={4} isInvalid={!!errors.contactEmail}>
                <FormLabel>Contact Email</FormLabel>
                <Input
                  name="contactEmail"
                  placeholder="Contact Email"
                  value={formData.contactEmail}
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
              colorScheme="green"
              bg={ColorBtn.AddBtnBg}
              onClick={handleSave}
            >
              Save
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

export default CustomerModal;
