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
  Box,
  Select,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
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

interface ProjectModalProps {
  addProject: (newProject: Project) => void;
  updateProject: (updatedProject: Project) => void;
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Project {
  id?: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerId: string;
}

interface FirestoreProjectData {
  projectId: string;
  projectName: string;
  customerName: string;
  customerId: string;
}

interface Customer {
  id: string;
  customerId: string;
  customerName: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  addProject,
  updateProject,
  project,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<Project>({
    projectId: "",
    projectName: "",
    customerName: "",
    customerId: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [errors, setErrors] = useState({
    projectName: "",
    customerName: "",
  });
  const [isSaving, setIsSaving] = useState(false); // สถานะการบันทึก
  const toast = useToast();

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customerList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Customer)
      );
      // Sort customers by customerId if it exists
      customerList.sort((a, b) => {
        if (a.customerId && b.customerId) {
          return a.customerId.localeCompare(b.customerId);
        } else if (a.customerId) {
          return -1; // a comes first
        } else if (b.customerId) {
          return 1; // b comes first
        } else {
          return 0; // No change in order
        }
      });
      setCustomers(customerList);
    };

    fetchCustomers();
  }, []);

  const resetForm = () => {
    setFormData({
      projectId: "",
      projectName: "",
      customerName: "",
      customerId: "",
    });
    setErrors({
      projectName: "",
      customerName: "",
    });
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
      const selectedCustomer = customers.find(
        (customer) =>
          `${customer.customerId} - ${customer.customerName}` === value
      );
      setFormData((prevData) => ({
        ...prevData,
        customerId: selectedCustomer?.customerId || "",
        customerName: selectedCustomer?.customerName || "",
      }));
    }
  };

  const getLastProjectId = async (): Promise<string | null> => {
    const projectsCollection = collection(db, "projects");
    const projectsQuery = query(
      projectsCollection,
      orderBy("projectId", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(projectsQuery);

    if (!querySnapshot.empty) {
      const lastProject = querySnapshot.docs[0].data() as FirestoreProjectData;
      return lastProject.projectId;
    }
    return null;
  };

  const generateNewProjectId = (lastProjectId: string | null): string => {
    if (!lastProjectId) {
      return "LS00001";
    }

    const numericPart = parseInt(lastProjectId.replace("LS", ""), 10);
    const newNumericPart = numericPart + 1;
    const newProjectId = `LS${newNumericPart.toString().padStart(5, "0")}`;

    return newProjectId;
  };

  const validateForm = () => {
    const newErrors = {
      projectName: "",
      customerName: "",
    };
    if (!formData.projectName) {
      newErrors.projectName = "Project Name is required";
    }
    if (!formData.customerName) {
      newErrors.customerName = "Customer Name is required";
    }
    setErrors(newErrors);

    return !newErrors.projectName && !newErrors.customerName;
  };

  const checkDuplicateProjectName = async (): Promise<boolean> => {
    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("projectName")
    );
    const querySnapshot = await getDocs(projectsQuery);
    const projectNames = querySnapshot.docs
      .filter((doc) => doc.id !== project?.id) // กรองโปรเจคที่กำลังแก้ไขออก
      .map((doc) => doc.data().projectName);
    return projectNames.includes(formData.projectName);
  };

  const handleSave = async () => {
    if (validateForm()) {
      const isDuplicate = await checkDuplicateProjectName();
      if (isDuplicate) {
        toast({
          title: "Error",
          description: "Project Name already exists.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsSaving(true); // ปิดการใช้งานปุ่ม Save
      try {
        let newProjectId = formData.projectId;
        if (!project) {
          const lastProjectId = await getLastProjectId();
          newProjectId = generateNewProjectId(lastProjectId);
        }
        const newProject: FirestoreProjectData = {
          projectId: newProjectId,
          projectName: formData.projectName,
          customerName: formData.customerName,
          customerId: formData.customerId,
        };
        if (project && project.id) {
          await updateDoc(doc(db, "projects", project.id), { ...newProject });
          updateProject({ ...newProject, id: project.id });
        } else {
          const docRef = await addDoc(collection(db, "projects"), {
            ...newProject,
          });
          addProject({ ...newProject, id: docRef.id });
        }
        onClose();
        resetForm();
      } catch (error) {
        console.error("Error saving project:", error);
        toast({
          title: "Error",
          description: "Failed to save project.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSaving(false); // เปิดการใช้งานปุ่ม Save อีกครั้ง
      }
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{project ? "Edit Project" : "Add Project"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={!!errors.projectName}>
            <FormLabel>Project Name</FormLabel>
            <Input
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Project Name"
            />
            {errors.projectName && (
              <FormErrorMessage>{errors.projectName}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4} isRequired isInvalid={!!errors.customerName}>
            <FormLabel>Customer Name</FormLabel>
            <Select
              name="customerName"
              value={`${formData.customerId} - ${formData.customerName}`}
              onChange={handleInputChange}
              placeholder="Select Customer"
            >
              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={`${customer.customerId} - ${customer.customerName}`}
                >
                  {customer.customerId} - {customer.customerName}
                </option>
              ))}
            </Select>
            {errors.customerName && (
              <FormErrorMessage>{errors.customerName}</FormErrorMessage>
            )}
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
              isDisabled={isSaving} // ปิดการใช้งานปุ่ม Save เมื่อกำลังบันทึกข้อมูล
            >
              Save
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;
