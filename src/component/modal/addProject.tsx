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
}

interface FirestoreProjectData {
  projectId: string;
  projectName: string;
  customerName: string;
}

interface Customer {
  id: string;
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
  });
  const [customers, setCustomers] = useState<Customer[]>([]);

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
      setCustomers(customerList);
    };

    fetchCustomers();
  }, []);

  const resetForm = () => {
    setFormData({
      projectId: "",
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

  const handleSave = async () => {
    if (formData.projectName && formData.customerName) {
      try {
        const lastProjectId = await getLastProjectId();
        const newProjectId = generateNewProjectId(lastProjectId);
        const newProject: FirestoreProjectData = {
          projectId: newProjectId,
          projectName: formData.projectName,
          customerName: formData.customerName,
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
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{project ? "Edit Project" : "Add Project"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Project Name"
            />
          </FormControl>
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
  );
};

export default ProjectModal;
