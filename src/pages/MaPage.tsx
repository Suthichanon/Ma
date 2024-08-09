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
  Button,
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
  useToast,
  Select,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaEllipsisH } from "react-icons/fa";
import MaintenanceAgreementModal from "../component/modal/addMa";
import { db } from "../firebase/firebaseAuth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ColorTable, ColorBtn } from "../component/templatecolor";
import dayjs from "dayjs";

interface MaintenanceAgreement {
  id?: string;
  maNumber: string;
  projectName: string;
  customerName: string;
  projectId: string;
  customerId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  maturity: string;
  status: string;
  remaining?: string;
}

const MaintenanceAgreements: React.FC = () => {
  const toast = useToast();
  const [agreements, setAgreements] = useState<MaintenanceAgreement[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [selectedAgreement, setSelectedAgreement] =
    useState<MaintenanceAgreement | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const fetchAgreements = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "maintenanceAgreements"), orderBy("maNumber"))
    );

    const agreementList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as MaintenanceAgreement;
      const endDate = dayjs(data.endDate.toDate());
      const startDate = dayjs(data.startDate.toDate());
      const now = dayjs();

      // Calculate remaining days from now to end date
      const remainingDays = endDate.diff(now, "day");

      // Calculate maturity in months from start date to end date
      const maturityMonths = endDate.diff(startDate, "month");

      // Determine status based on remaining days
      let status = "expire";
      if (remainingDays > 60) {
        status = "active";
      } else if (remainingDays > 0 && remainingDays <= 60) {
        status = "duration";
      }

      return {
        ...data,
        id: doc.id,
        remaining: `${remainingDays} DAY${remainingDays !== 1 ? "S" : ""}`,
        maturity: `${maturityMonths} MONTH${maturityMonths !== 1 ? "S" : ""}`,
        status: status,
      };
    });

    setAgreements(agreementList);
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const addAgreement = (newAgreement: MaintenanceAgreement) => {
    setAgreements([...agreements, newAgreement]);
    toast({
      title: "Agreement added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setSelectedAgreement(null);
    fetchAgreements(); // Refresh the list
  };

  const updateAgreement = (updatedAgreement: MaintenanceAgreement) => {
    setAgreements(
      agreements.map((agreement) =>
        agreement.id === updatedAgreement.id ? updatedAgreement : agreement
      )
    );
    fetchAgreements(); // Refresh the list
  };

  const handleEdit = (agreement: MaintenanceAgreement) => {
    setSelectedAgreement(agreement);
    onOpen();
  };

  const handleAddAgreement = () => {
    setSelectedAgreement(null);
    onOpen();
  };

  const handleDelete = async (agreementId: string) => {
    try {
      await deleteDoc(doc(db, "maintenanceAgreements", agreementId));
      setAgreements((prevAgreements) => {
        const updatedAgreements = prevAgreements.filter(
          (agreement) => agreement.id !== agreementId
        );

        // Check if the current page has no items left after deletion
        const totalRemainingItems = updatedAgreements.length;
        const totalPagesAfterDeletion = Math.ceil(
          totalRemainingItems / rowsPerPage
        );

        // If the current page is now empty and it's not the first page, go back one page
        if (currentPage > totalPagesAfterDeletion && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        return updatedAgreements;
      });

      toast({
        title: "Agreement deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onDeleteClose();
    } catch (error) {
      console.error("Error deleting agreement:", error);
      toast({
        title: "Error",
        description: "Failed to delete agreement.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedAgreement && selectedAgreement.id) {
      await handleDelete(selectedAgreement.id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredAgreements = agreements.filter(
    (agreement) =>
      agreement.maNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.projectName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      agreement.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgreements.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedAgreements = filteredAgreements.slice(
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

  const getStatusButton = (remaining: string | undefined): JSX.Element => {
    if (!remaining) {
      remaining = "0 DAYS"; // Default value when remaining is undefined
    }

    const days = parseInt(remaining.split(" ")[0], 10);

    if (days > 60) {
      return (
        <Button
          w={"100%"}
          color={"white"}
          backgroundColor="#01B574"
          _hover={{ backgroundColor: "#01A367" }}
          pointerEvents={"none"}
        >
          Active
        </Button>
      );
    } else if (days > 0 && days <= 60) {
      return (
        <Button
          w={"100%"}
          color={"white"}
          backgroundColor="#FFB547"
          _hover={{ backgroundColor: "#E5A23A" }}
          pointerEvents={"none"}
        >
          Duration
        </Button>
      );
    } else {
      return (
        <Button
          w={"100%"}
          color={"white"}
          backgroundColor="#E31A1A"
          _hover={{ backgroundColor: "#CC1717" }}
          pointerEvents={"none"}
        >
          Expire
        </Button>
      );
    }
  };

  return (
    <Box minH="100%" minW="100%" px={{ base: 2, lg: 12 }}>
      <Box pt={10} fontSize={20}>
        <Text>PROJECT / Maintenance Agreement</Text>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Maintenance Agreement
        </Text>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} mb={4}>
        <InputGroup width={{ base: "100%", md: "500px" }}>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Ma Number, Project Name, Customer Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button
          onClick={handleAddAgreement}
          leftIcon={<Image src="/addicon.png" alt="Add Icon" boxSize="24px" />}
          colorScheme="green"
          variant="solid"
          size="lg"
          bg={ColorBtn.AddBtnBg}
        >
          Add MA
        </Button>
        <MaintenanceAgreementModal
          addAgreement={addAgreement}
          updateAgreement={updateAgreement}
          agreement={selectedAgreement}
          isOpen={isOpen}
          onClose={onClose}
          refreshData={fetchAgreements} // Pass the refresh function
        />
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
                MA NUMBER
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                PROJECT NAME
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                CUSTOMER NAME
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                START DATE
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                END DATE
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                MATURITY
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                REMAINING
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                STATUS
              </Th>

              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                MANAGE
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedAgreements.map((agreement, index) => (
              <Tr key={index}>
                <Td textAlign="center">{agreement.maNumber}</Td>
                <Td textAlign="center">{agreement.projectName}</Td>
                <Td textAlign="center">{agreement.customerName}</Td>
                <Td textAlign="center">
                  {dayjs(agreement.startDate.toDate()).format("DD/MM/YYYY")}
                </Td>
                <Td textAlign="center">
                  {dayjs(agreement.endDate.toDate()).format("DD/MM/YYYY")}
                </Td>
                <Td textAlign="center">{agreement.maturity}</Td>
                <Td textAlign="center">{agreement.remaining}</Td>
                <Td textAlign="center">
                  {getStatusButton(agreement.remaining)}
                </Td>

                <Td textAlign="center">
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FaEllipsisH />}
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleEdit(agreement)}>
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSelectedAgreement(agreement);
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

      <Box display="flex" my={4} w="100%" alignItems="center">
        <Text>
          Page {currentPage} of {totalPages} (Total {filteredAgreements.length}{" "}
          agreements)
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
              Delete Maintenance Agreement
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this maintenance agreement? This
              action cannot be undone.
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

export default MaintenanceAgreements;
