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
  Textarea,
  Box,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  MenuItem,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { db } from "../../firebase/firebaseAuth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { ColorBtn } from "../templatecolor";

interface SupportTicketModalProps {
  addTicket: (newTicket: SupportTicket) => void;
  updateTicket: (updatedTicket: SupportTicket) => void;
  ticket?: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SupportTicket {
  id?: string;
  ticketId: string;
  maNumber: string;
  projectName: string;
  issueDescription: string;
  typeIssue: string;
  customerId?: string;
}

interface MaintenanceAgreement {
  maNumber: string;
  projectName: string;
  customerId: string;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  addTicket,
  updateTicket,
  ticket,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState<SupportTicket>({
    ticketId: "",
    maNumber: "",
    projectName: "",
    issueDescription: "",
    typeIssue: "",
    customerId: "",
  });
  const [maNumbers, setMaNumbers] = useState<MaintenanceAgreement[]>([]);
  const [searchResults, setSearchResults] = useState<MaintenanceAgreement[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); // State for form validation
  const [errors, setErrors] = useState<Partial<SupportTicket>>({});

  const tooltips: { [key: string]: string } = {
    "User Error":
      "การใช้งานผิดวิธี: ผู้ใช้ไม่เข้าใจวิธีการใช้งานหรือป้อนข้อมูลผิดพลาด",
    "System Bugs":
      "ข้อผิดพลาด: ทำให้ระบบล่มหรือหยุดทำงาน ส่งผลต่อการทำงานของระบบ แต่ยังใช้งานได้บางส่วน",
    "Performance Issues":
      "ระบบช้า: ทำงานช้ากว่าปกติ ส่งผลให้การทำงานล่าช้า ระบบใช้ทรัพยากรเครื่องมากเกินไป",
    "Integration Issues":
      "การเชื่อมต่อล้มเหลว: ระบบไม่สามารถเชื่อมต่อกับซอฟต์แวร์หรือระบบอื่นๆ ได้",
    "Data Issues":
      "ข้อมูลสูญหาย: ข้อมูลหายไปจากระบบ หรือไม่ถูกต้อง ไม่สามารถเข้าถึงข้อมูลได้",
    "Security Issues":
      "การเจาะระบบ: ระบบถูกโจมตีหรือเข้าถึงโดยไม่ได้รับอนุญาต ข้อมูลถูกเปิดเผยหรือขโมย",
  };

  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
      setSearchQuery(ticket.maNumber);
    } else {
      resetForm();
    }
  }, [ticket, isOpen]);

  useEffect(() => {
    const fetchMANumbers = async () => {
      const querySnapshot = await getDocs(
        collection(db, "maintenanceAgreements")
      );
      const maNumbersList = querySnapshot.docs.map(
        (doc) => doc.data() as MaintenanceAgreement
      );
      setMaNumbers(maNumbersList);
    };

    fetchMANumbers();
  }, []);

  // Validate form on data change
  useEffect(() => {
    const isValid =
      formData.maNumber !== "" &&
      formData.issueDescription !== "" &&
      formData.typeIssue !== "";

    setIsFormValid(isValid);
  }, [formData]);

  const resetForm = () => {
    setFormData({
      ticketId: "",
      maNumber: "",
      projectName: "",
      issueDescription: "",
      typeIssue: "",
      customerId: "",
    });
    setSearchQuery("");
    setSearchResults([]);
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof SupportTicket]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = maNumbers.filter((ma) =>
        ma.maNumber.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<SupportTicket> = {};
    if (!formData.maNumber) newErrors.maNumber = "MA Number is required";
    if (!formData.typeIssue) newErrors.typeIssue = "Type Issue is required";
    if (!formData.issueDescription)
      newErrors.issueDescription = "Issue Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const newTicket: SupportTicket = {
        ...formData,
      };

      if (!ticket) {
        const lastTicketSnapshot = await getDocs(
          query(
            collection(db, "supportTickets"),
            orderBy("ticketId", "desc"),
            limit(1)
          )
        );

        const lastTicketId = lastTicketSnapshot.docs[0]?.data()?.ticketId;
        const nextTicketId = lastTicketId
          ? `ST${(parseInt(lastTicketId.slice(2)) + 1)
              .toString()
              .padStart(6, "0")}`
          : "ST000001";

        newTicket.ticketId = nextTicketId;
      }

      if (ticket && ticket.id) {
        await updateDoc(doc(db, "supportTickets", ticket.id), {
          ...newTicket,
        });
        updateTicket({ ...newTicket, id: ticket.id });
        toast({
          title: "Success",
          description: "Ticket updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const maRecord = maNumbers.find(
          (ma) => ma.maNumber === formData.maNumber
        );
        if (maRecord) {
          newTicket.customerId = maRecord.customerId;
        }

        const docRef = await addDoc(collection(db, "supportTickets"), {
          ...newTicket,
        });
        addTicket({ ...newTicket, id: docRef.id });
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast({
        title: "Error",
        description: "There was an error saving the ticket.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{ticket ? "Edit" : "Add"} Ticket Support</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" justifyContent="center" mb={4}>
            <Box
              display="flex"
              textAlign={"center"}
              fontSize={20}
              fontWeight={600}
            >
              ISSUE INFORMATION
            </Box>
          </Box>
          <FormControl isRequired isInvalid={!!errors.maNumber}>
            <FormLabel fontSize={18} fontWeight={600}>
              MA Number
            </FormLabel>
            <Box position="relative">
              <Input
                name="maNumber"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="exp.MA00001"
                isReadOnly={!!ticket}
                bg={ticket ? "gray.100" : "white"}
                pointerEvents={ticket ? "none" : "auto"}
              />
              {searchResults.length > 0 && !ticket && (
                <Box
                  position="absolute"
                  background="white"
                  boxShadow="md"
                  zIndex={1000}
                  width="100%"
                  maxHeight="200px"
                  overflowY="auto"
                >
                  <List>
                    {searchResults.map((result) => (
                      <ListItem
                        key={result.maNumber}
                        onClick={() => {
                          setFormData((prevData) => ({
                            ...prevData,
                            maNumber: result.maNumber,
                            projectName: result.projectName,
                            customerId: result.customerId, // กำหนด customerId เมื่อเลือก MA Number
                          }));
                          setSearchQuery(result.maNumber);
                          setSearchResults([]);
                        }}
                        cursor="pointer"
                        _hover={{ background: "gray.100" }}
                        padding={2}
                      >
                        {result.maNumber}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
            <FormErrorMessage>{errors.maNumber}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired mt={4} isInvalid={!!errors.typeIssue}>
            <FormLabel fontSize={18} fontWeight={600}>
              Type Issue
            </FormLabel>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {formData.typeIssue || "Select Type"}
              </MenuButton>
              <MenuList>
                {Object.keys(tooltips).map((issueType) => (
                  <Popover trigger="hover" key={issueType} placement="right">
                    <PopoverTrigger>
                      <Box as="div">
                        <MenuItem
                          onClick={() =>
                            setFormData((prevData) => ({
                              ...prevData,
                              typeIssue: issueType,
                            }))
                          }
                        >
                          {issueType}
                        </MenuItem>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>{issueType}</PopoverHeader>
                      <PopoverBody>{tooltips[issueType]}</PopoverBody>
                    </PopoverContent>
                  </Popover>
                ))}
              </MenuList>
            </Menu>
            <FormErrorMessage>{errors.typeIssue}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired mt={4} isInvalid={!!errors.issueDescription}>
            <FormLabel fontSize={18} fontWeight={600}>
              Issue Description
            </FormLabel>
            <Textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleInputChange}
              placeholder="Issue Description"
              height="200px"
            />
            <FormErrorMessage>{errors.issueDescription}</FormErrorMessage>
          </FormControl>
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
              isLoading={isSaving}
              loadingText="Saving..."
              isDisabled={!isFormValid} // Disable button if form is not valid
            >
              Save
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SupportTicketModal;
