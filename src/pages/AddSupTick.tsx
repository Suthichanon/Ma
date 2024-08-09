import React, { useState, useEffect, useCallback } from "react";
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
import SupportTicketModal from "../component/modal/addTicket";
import ViewTicketModal from "../component/modal/viewTicketModal";
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

interface SupportTicket {
  id?: string;
  ticketId: string;
  maNumber: string;
  projectName: string;
  issueDescription: string;
  typeIssue: string;
}

const SupportTickets: React.FC = () => {
  const toast = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsQuery = query(
        collection(db, "supportTickets"),
        orderBy("ticketId")
      );
      const querySnapshot = await getDocs(ticketsQuery);
      const ticketList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SupportTicket)
      );
      setTickets(ticketList);
    };

    fetchTickets();
  }, []);

  const addTicket = (newTicket: SupportTicket) => {
    setTickets((prevTickets) => [...prevTickets, newTicket]);
    toast({
      title: "Ticket added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setSelectedTicket(null);
  };

  const updateTicket = (updatedTicket: SupportTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  const handleModalOpen = useCallback(
    (ticket: SupportTicket | null, openModal: () => void) => {
      if (isViewOpen) {
        onViewClose();
        setTimeout(() => {
          setSelectedTicket(ticket);
          openModal();
        }, 300); // Delay to ensure view modal is completely closed
      } else if (isEditOpen) {
        onEditClose();
        setTimeout(() => {
          setSelectedTicket(ticket);
          openModal();
        }, 300); // Delay to ensure edit modal is completely closed
      } else {
        setSelectedTicket(ticket);
        openModal();
      }
    },
    [isEditOpen, isViewOpen, onEditClose, onViewClose]
  );

  const handleAddTicket = () => handleModalOpen(null, onEditOpen);

  const handleEdit = (ticket: SupportTicket) =>
    handleModalOpen(ticket, onEditOpen);

  const handleView = (ticket: SupportTicket) =>
    handleModalOpen(ticket, onViewOpen);

  const handleDelete = async (ticketId: string) => {
    try {
      await deleteDoc(doc(db, "supportTickets", ticketId));
      setTickets((prevTickets) => {
        const updatedTickets = prevTickets.filter(
          (ticket) => ticket.id !== ticketId
        );

        // Check if the current page has no items left after deletion
        const totalRemainingItems = updatedTickets.length;
        const totalPagesAfterDeletion = Math.ceil(
          totalRemainingItems / rowsPerPage
        );

        // If the current page is now empty and it's not the first page, go back one page
        if (currentPage > totalPagesAfterDeletion && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        return updatedTickets;
      });

      toast({
        title: "Ticket deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onDeleteClose();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error deleting ticket",
        description:
          "There was an issue deleting the ticket. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedTicket && selectedTicket.id) {
      await handleDelete(selectedTicket.id);
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

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.maNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedTickets = filteredTickets.slice(
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
        <Text>SUPPORT TICKET / Support Ticket</Text>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Support Ticket
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
            placeholder="MA Number, Project Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button
          onClick={handleAddTicket}
          leftIcon={<FaPlusSquare />}
          colorScheme="green"
          variant="solid"
          size="lg"
          bg={ColorBtn.AddBtnBg}
        >
          Add Issue
        </Button>
        <SupportTicketModal
          addTicket={addTicket}
          updateTicket={updateTicket}
          ticket={selectedTicket}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      </Box>

      <TableContainer
        border="1px solid"
        borderColor={ColorTable.TableBorder}
        
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
                TICKET ID
              </Th>
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
                ISSUE DESCRIPTION
              </Th>
              <Th
                color={ColorTable.TableHeadText}
                fontSize={ColorTable.TableTextSize}
                textAlign="center"
                fontWeight={ColorTable.TableTextWeight}
              >
                TYPE ISSUE
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
            {selectedTickets.map((ticket, index) => (
              <Tr
                key={index}
                onClick={() => handleView(ticket)}
                cursor="pointer"
              >
                <Td textAlign="center">{ticket.ticketId}</Td>
                <Td textAlign="center">{ticket.maNumber}</Td>
                <Td textAlign="center">{ticket.projectName}</Td>
                <Td textAlign="center">
                  {ticket.issueDescription.length > 30
                    ? `${ticket.issueDescription.slice(0, 30)}...`
                    : ticket.issueDescription}
                </Td>
                <Td textAlign="center">{ticket.typeIssue}</Td>
                <Td textAlign="center">
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FaEllipsisH />}
                      variant="outline"
                      onClick={(e) => e.stopPropagation()} // Prevent row click
                    />
                    <MenuList>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleEdit(ticket);
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          setSelectedTicket(ticket);
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
          Page {currentPage} of {totalPages} (Total {filteredTickets.length} tickets)
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
              Delete Ticket
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this ticket? This action cannot be
              undone.
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

      <ViewTicketModal
        ticket={selectedTicket}
        isOpen={isViewOpen}
        onClose={onViewClose}
      />
    </Box>
  );
};

export default SupportTickets;
