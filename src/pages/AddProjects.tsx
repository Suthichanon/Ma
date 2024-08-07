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
import ProjectModal from "../component/modal/addProject";
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

interface Project {
  id?: string;
  projectId: string;
  projectName: string;
  customerName: string;
  customerId: string; 
}

const Projects: React.FC = () => {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsQuery = query(
        collection(db, "projects"),
        orderBy("projectId")
      );
      const querySnapshot = await getDocs(projectsQuery);
      const projectList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
      setProjects(projectList);
    };

    fetchProjects();
  }, []);

  const addProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
    toast({
      title: "Project added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setSelectedProject(null);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    onOpen();
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects(projects.filter((project) => project.id !== projectId));
      onDeleteClose();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const confirmDelete = async () => {
    if (selectedProject && selectedProject.id) {
      await handleDelete(selectedProject.id);
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

  const totalPages = Math.ceil(projects.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedProjects = projects.slice(startIndex, startIndex + rowsPerPage);

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
        <Text>PROJECT / Project</Text>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Project
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
            placeholder="Project ID, Project Name, Customer Name"
          />
        </InputGroup>
        <Button
          onClick={handleAddProject}
          leftIcon={<FaPlusSquare />}
          colorScheme="red"
          variant="solid"
          size="lg"
          bg={ColorBtn.AddBtnBg}
        >
          Add Project
        </Button>
        <ProjectModal
          addProject={addProject}
          updateProject={updateProject}
          project={selectedProject}
          isOpen={isOpen}
          onClose={onClose}
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
                PROJECT ID
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
                MANAGE
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedProjects.map((project, index) => (
              <Tr key={index}>
                <Td textAlign="center">{project.projectId}</Td>
                <Td textAlign="center">{project.projectName}</Td>
                <Td textAlign="center">{project.customerName}</Td>
                <Td textAlign="center">
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FaEllipsisH />}
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleEdit(project)}>
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSelectedProject(project);
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
              Delete Project
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this project? This action cannot
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

export default Projects;
