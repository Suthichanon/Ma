import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";

// Use the SupportTicket type defined in the parent component
interface SupportTicket {
  id?: string;
  ticketId: string;
  maNumber: string;
  projectName: string;
  issueDescription: string;
  typeIssue: string;
}

interface ViewTicketModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<SupportTicket>({
    ticketId: "",
    maNumber: "",
    projectName: "",
    issueDescription: "",
    typeIssue: "",
  });

  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      resetForm();
    }
  }, [ticket, isOpen]);

  const resetForm = () => {
    setFormData({
      ticketId: "",
      maNumber: "",
      projectName: "",
      issueDescription: "",
      typeIssue: "",
    });
  };

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>VIEW TICKET SUPPORT</ModalHeader>
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
          <FormControl>
            <FormLabel fontSize={18} fontWeight={600}>
              MA Number
            </FormLabel>
            <Input
              name="maNumber"
              value={formData.maNumber}
              isReadOnly
              bg="gray.100"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel fontSize={18} fontWeight={600}>
              Type Issue
            </FormLabel>
            <Input
              name="typeIssue"
              value={formData.typeIssue}
              isReadOnly
              bg="gray.100"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel fontSize={18} fontWeight={600}>
              Issue Description
            </FormLabel>
            <Textarea
              name="issueDescription"
              value={formData.issueDescription}
              isReadOnly
              height="500px"
              bg="gray.100"
              resize="none"
              css={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Box w={"100%"} display={"flex"} justifyContent={"center"}>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewTicketModal;
