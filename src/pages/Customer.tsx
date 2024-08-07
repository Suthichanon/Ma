import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Grid,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
  Select,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ColorTable, ColorBtn } from "../component/templatecolor";
import { FaEllipsisH } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import CustomerModal from "../component/modal/addCustomer";
import ViewCustomerModal from "../component/modal/viewCustomerModal";
import { db } from "../firebase/firebaseAuth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

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

const Customers: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname.replace(/\//g, " ");
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customerList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Customer)
      );
      customerList.sort((a, b) =>
        (a.customerId ?? "").localeCompare(b.customerId ?? "")
      );
      setCustomers(customerList);
      setFilteredCustomers(customerList); // เริ่มต้นด้วยข้อมูลทั้งหมด
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        (customer.customerId ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        customer.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        customer.taxIdOrIdCard
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (customer.idCard && customer.idCard.includes(searchQuery))
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  const addCustomer = (newCustomer: Customer) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers, newCustomer];
      updatedCustomers.sort((a, b) =>
        (a.customerId ?? "").localeCompare(b.customerId ?? "")
      );
      return updatedCustomers;
    });
    toast({
      title: "Add customer success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setSelectedCustomer(null);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      );
      updatedCustomers.sort((a, b) =>
        (a.customerId ?? "").localeCompare(b.customerId ?? "")
      );
      return updatedCustomers;
    });
    toast({
      title: "Edit customer success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    onViewClose();
    onEditOpen();
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    onEditClose();
    onViewOpen();
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    onEditOpen();
  };

  const handleDelete = async (customerId: string) => {
    try {
      await deleteDoc(doc(db, "customers", customerId));
      setCustomers((prevCustomers) => {
        const updatedCustomers = prevCustomers.filter(
          (customer) => customer.id !== customerId
        );

        // Check if the current page has no items left after deletion
        const totalRemainingItems = updatedCustomers.length;
        const totalPagesAfterDeletion = Math.ceil(
          totalRemainingItems / rowsPerPage
        );

        // If the current page is now empty and it's not the first page, go back one page
        if (currentPage > totalPagesAfterDeletion && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        updatedCustomers.sort((a, b) =>
          (a.customerId ?? "").localeCompare(b.customerId ?? "")
        );

        return updatedCustomers;
      });
      toast({
        title: "Delete customer success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error deleting customer",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedCustomer && selectedCustomer.id) {
      await handleDelete(selectedCustomer.id);
      onDeleteClose();
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
  };

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => handlePageChange(i)}
            variant={currentPage === i ? "solid" : "outline"}
            mx={1}
          >
            {i}
          </Button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(
          <Text key={i} mx={1}>
            ...
          </Text>
        );
      }
    }
    return pageNumbers;
  };

  return (
    <Box minH="100%" minW="100%" px={{ base: 2, lg: 12 }}>
      <Box pt={10} fontSize={20}>
        <Text>{pathname}</Text>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Customer
        </Text>
      </Box>
      <Box mb={4}>
        <Grid templateColumns={{ base: "1fr", md: "1fr auto" }} gap={4}>
          <InputGroup width={{ base: "100%", md: "500px" }}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Search by Customer ID, Name, Tax ID / ID Card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Button
            onClick={handleAddCustomer}
            leftIcon={
              <Image src="/addicon.png" alt="Add Icon" boxSize="24px" />
            }
            colorScheme="green"
            variant="solid"
            size="lg"
            bg={ColorBtn.AddBtnBg}
          >
            Add Customer
          </Button>
          <CustomerModal
            addCustomer={addCustomer}
            updateCustomer={updateCustomer}
            customer={selectedCustomer}
            isOpen={isEditOpen}
            onClose={onEditClose}
          />
          <ViewCustomerModal
            customer={selectedCustomer}
            isOpen={isViewOpen}
            onClose={onViewClose}
          />
        </Grid>
      </Box>

      <TableContainer border="1px solid" borderColor={ColorTable.TableBorder}>
        <Table>
          <Thead bg={ColorTable.TableHead}>
            <Tr>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Customer ID
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Customer Name
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Tax ID / ID Card
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Contact Person
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Mobile
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Email
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                Manage
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedCustomers.map((customer, index) => (
              <Tr
                key={index}
                onClick={() => handleView(customer)}
                style={{ cursor: "pointer" }}
              >
                <Td textAlign="center">{customer.customerId}</Td>
                <Td textAlign="center">{customer.customerName}</Td>
                <Td textAlign="center">
                  {customer.customerType === "corporation"
                    ? customer.taxIdOrIdCard
                    : customer.idCard}
                </Td>
                <Td textAlign="center">{customer.contactName}</Td>
                <Td textAlign="center">{customer.mobile}</Td>
                <Td textAlign="center">{customer.email}</Td>
                <Td textAlign="center" onClick={(e) => e.stopPropagation()}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={
                        <FaEllipsisH
                          style={{ color: "2F2F2F", fontSize: "18px" }}
                        />
                      }
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleEdit(customer)}>
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSelectedCustomer(customer);
                          onDeleteOpen();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box display={"flex"} my={4} w={"100%"} alignItems="center">
        <Text>
          Page {currentPage} of {totalPages} (Total {filteredCustomers.length}{" "}
          customers)
        </Text>
        <Box display="flex" alignItems="center" ml="auto">
          <Select
            width="80px"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </Select>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flex={1}
        >
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            mx={1}
          >
            Previous
          </Button>
          {renderPageNumbers()}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            mx={1}
          >
            Next
          </Button>
        </Box>
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Customers;
