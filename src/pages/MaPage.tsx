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
import { FaEllipsisH, FaPlusSquare } from "react-icons/fa";
import MaintenanceAgreementModal from "../component/modal/addMa";
import { db } from "../firebase/firebaseAuth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ColorTable, ColorBtn } from "../component/templatecolor";
import dayjs from "dayjs";

interface MaintenanceAgreement {
  id?: string;
  maNumber: string;
  projectName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  maturity: string;
  status: string;
}

const MaintenanceAgreements: React.FC = () => {
  const toast = useToast();
  const [agreements, setAgreements] = useState<MaintenanceAgreement[]>([]);
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
    const agreementList = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as MaintenanceAgreement)
    );
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
      setAgreements(
        agreements.filter((agreement) => agreement.id !== agreementId)
      );
      onDeleteClose();
    } catch (error) {
      console.error("Error deleting agreement:", error);
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

  const totalPages = Math.ceil(agreements.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedAgreements = agreements.slice(
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

  const getStatusButton = (maturity: string) => {
    const days = parseInt(maturity.split(" ")[0], 10);
    if (days > 60) {
      return <Button w={'100%'} color={'white'} colorScheme="green">Active</Button>;
    } else if (days > 0) {
      return <Button w={'100%'} color={'white'} colorScheme="yellow">Duration</Button>;
    } else {
      return <Button w={'100%'} color={'white'} colorScheme="red">Expire</Button>;
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
        <InputGroup width="300px">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Ma Number, Project Name, Customer Name"
          />
        </InputGroup>
        <Button
          onClick={handleAddAgreement}
          leftIcon={<FaPlusSquare />}
          colorScheme="red"
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

      <TableContainer
        border="1px solid"
        borderColor={ColorTable.TableBorder}
        borderRadius="16px"
      >
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
                  {dayjs(agreement.startDate).format("DD/MM/YYYY")}
                </Td>
                <Td textAlign="center">{agreement.endDate}</Td>
                <Td textAlign="center">{agreement.maturity}</Td>
                <Td textAlign="center">
                  {getStatusButton(agreement.maturity)}
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

      <Box display="flex" my={4} w="100%">
        <Box display="flex" alignItems="center" flex={1}>
          <Text>Rows per page:</Text>
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
