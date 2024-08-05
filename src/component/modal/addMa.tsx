import React, { useState, useEffect, useCallback } from "react";
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
  Select,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import { db } from "../../firebase/firebaseAuth";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface MaintenanceAgreementModalProps {
  addAgreement: (newAgreement: MaintenanceAgreement) => void;
  updateAgreement: (updatedAgreement: MaintenanceAgreement) => void;
  agreement?: MaintenanceAgreement | null;
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}

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

interface Project {
  id: string;
  projectName: string;
  customerName: string;
}

interface Customer {
  id: string;
  customerName: string;
}

const MaintenanceAgreementModal: React.FC<MaintenanceAgreementModalProps> = ({
  addAgreement,
  updateAgreement,
  agreement,
  isOpen,
  onClose,
  refreshData,
}) => {
  const [formData, setFormData] = useState<MaintenanceAgreement>({
    maNumber: "",
    projectName: "",
    customerName: "",
    startDate: "",
    endDate: "",
    maturity: "",
    status: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const [isFormValid, setIsFormValid] = useState(false);

  const fetchProjectsForCustomer = useCallback(
    (customerName: string) => {
      const filtered = projects.filter(
        (project) => project.customerName === customerName
      );
      setFilteredProjects(filtered);
    },
    [projects]
  );

  const fetchProjectsAndCustomers = useCallback(async () => {
    const customersSnapshot = await getDocs(
      query(collection(db, "customers"), orderBy("customerName"))
    );
    const projectSnapshot = await getDocs(collection(db, "projects"));
    const agreementsSnapshot = await getDocs(
      collection(db, "maintenanceAgreements")
    );

    const customerList = customersSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Customer)
    );
    const projectList = projectSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Project)
    );

    const usedProjects = new Set(
      agreementsSnapshot.docs.map((doc) => doc.data().projectName)
    );

    const availableProjects = projectList.filter(
      (project) => !usedProjects.has(project.projectName)
    );

    const customersWithProjects = customerList.filter((customer) =>
      availableProjects.some(
        (project) => project.customerName === customer.customerName
      )
    );

    setCustomers(customersWithProjects);
    setProjects(availableProjects);
  }, []);

  useEffect(() => {
    if (agreement) {
      setFormData(agreement);
      fetchProjectsForCustomer(agreement.customerName);
    } else {
      resetForm();
    }
  }, [agreement, isOpen, fetchProjectsForCustomer]);

  useEffect(() => {
    if (isOpen) {
      fetchProjectsAndCustomers();
    }
  }, [isOpen, fetchProjectsAndCustomers]);

  useEffect(() => {
    const calculateMaturity = () => {
      if (formData.startDate && formData.endDate) {
        const end = dayjs(formData.endDate, "DD/MM/YYYY");
        const today = dayjs();
        const daysDiff = end.diff(today, "day");

        setFormData((prevData) => ({
          ...prevData,
          maturity: `${daysDiff} DAY${daysDiff !== 1 ? "S" : ""}`,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          maturity: "",
        }));
      }
    };

    calculateMaturity();
    const interval = setInterval(calculateMaturity, 86400000); // Recalculate every 24 hours

    return () => clearInterval(interval);
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    const isValid =
      formData.customerName &&
      formData.projectName &&
      formData.startDate &&
      formData.endDate;
    setIsFormValid(Boolean(isValid));
  }, [formData]);

  const resetForm = () => {
    setFormData({
      maNumber: "",
      projectName: "",
      customerName: "",
      startDate: "",
      endDate: "",
      maturity: "",
      status: "",
    });
    setFilteredProjects([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "customerName") {
      fetchProjectsForCustomer(value);
      setFormData((prevData) => ({
        ...prevData,
        projectName: "",
      }));
    }

    if (name === "startDate") {
      const newEndDate = dayjs(value, "YYYY-MM-DD")
        .add(365, "day")
        .format("DD/MM/YYYY");
      setFormData((prevData) => ({
        ...prevData,
        endDate: newEndDate,
      }));
    }
  };

  const getLastMANumber = async (): Promise<string | null> => {
    const agreementsCollection = collection(db, "maintenanceAgreements");
    const agreementsQuery = query(
      agreementsCollection,
      orderBy("maNumber", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(agreementsQuery);

    if (!querySnapshot.empty) {
      const lastAgreement =
        querySnapshot.docs[0].data() as MaintenanceAgreement;
      return lastAgreement.maNumber;
    }
    return null;
  };

  const generateNewMANumber = (lastMANumber: string | null): string => {
    if (!lastMANumber) {
      return "MA00001";
    }

    const numericPart = parseInt(lastMANumber.replace("MA", ""), 10);
    const newNumericPart = numericPart + 1;
    return `MA${newNumericPart.toString().padStart(5, "0")}`;
  };

  const handleSave = () => {
    if (isFormValid) {
      setConfirmOpen(true);
    } else {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmSave = async () => {
    if (
      formData.projectName &&
      formData.customerName &&
      formData.startDate &&
      formData.maturity &&
      !isSaving
    ) {
      setIsSaving(true);
      try {
        const lastMANumber = await getLastMANumber();
        const newMANumber = generateNewMANumber(lastMANumber);
        const newAgreement: MaintenanceAgreement = {
          ...formData,
          maNumber: newMANumber,
        };
        if (agreement && agreement.id) {
          await updateDoc(doc(db, "maintenanceAgreements", agreement.id), {
            ...newAgreement,
          });
          updateAgreement({ ...newAgreement, id: agreement.id });
        } else {
          const docRef = await addDoc(collection(db, "maintenanceAgreements"), {
            ...newAgreement,
          });
          addAgreement({ ...newAgreement, id: docRef.id });
        }
        onClose();
        resetForm();
        setConfirmOpen(false);
        refreshData(); // Refresh data after save
      } catch (error) {
        console.error("Error saving agreement:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"5xl"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {agreement
              ? "Edit Maintenance Agreement"
              : "Add Maintenance Agreement"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={4} isRequired>
              <FormLabel>Customer Name</FormLabel>
              <Select
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Select Customer"
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.customerName}>
                    {customer.customerName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Project Name</FormLabel>
              <Select
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Select Project"
                isDisabled={filteredProjects.length === 0}
              >
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <option key={project.id} value={project.projectName}>
                      {project.projectName}
                    </option>
                  ))
                ) : (
                  <option value="">No projects available</option>
                )}
              </Select>
              {filteredProjects.length === 0 && (
                <Text mt={2} color="red.500">
                  No projects available for the selected customer.
                </Text>
              )}
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                pattern="\d{2}/\d{2}/\d{4}"
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                readOnly
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Maturity</FormLabel>
              <Input name="maturity" value={formData.maturity} isReadOnly />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Box w={"100%"} display={"flex"} justifyContent={"center"}>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={handleSave}
                isDisabled={isSaving || !isFormValid}
              >
                Save
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box textAlign={"center"} w={"100%"}>
              TERM OF MAINTENANCE
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center">
              <Text>
                START DAY: {dayjs(formData.startDate).format("DD/MM/YYYY")}
              </Text>
              <Text>END DAY: {formData.endDate}</Text>
              <Text>Duration: {formData.maturity}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setConfirmOpen(false)}
              isDisabled={isSaving}
            >
              Back
            </Button>
            <Button
              colorScheme="green"
              onClick={confirmSave}
              isDisabled={isSaving}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MaintenanceAgreementModal;
