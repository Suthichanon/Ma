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
  useBreakpointValue,
  Grid,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ColorTable } from "../component/templatecolor";
import { FaEllipsisH } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import CustomerModal from "../component/modal/addCustomer";
import { db } from "../firebase/firebaseAuth";
import { collection, getDocs } from "firebase/firestore";

interface Customer {
  customerName: string;
  taxIdOrIdCard: string;
  contactName: string;
  mobile: string;
  email: string;
}

const Customers: React.FC = () => {
  const inputWidth = useBreakpointValue({ base: "100%", md: "300px" });
  const location = useLocation();
  const pathname = location.pathname.replace(/\//g, " ");

  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "customers"));
      const customerList = querySnapshot.docs.map((doc) => doc.data() as Customer);
      setCustomers(customerList);
    };

    fetchCustomers();
  }, []);

  const addCustomer = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
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
          <InputGroup width={inputWidth}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input type="text" placeholder="Customer Name , Tax ID / ID Card" />
          </InputGroup>
          <CustomerModal addCustomer={addCustomer} />
        </Grid>
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
            {customers.map((customer, index) => (
              <Tr key={index}>
                <Td textAlign="center">{customer.customerName}</Td>
                <Td textAlign="center">{customer.taxIdOrIdCard}</Td>
                <Td textAlign="center">{customer.contactName}</Td>
                <Td textAlign="center">{customer.mobile}</Td>
                <Td textAlign="center">{customer.email}</Td>
                <Td textAlign="center">
                  <IconButton
                    aria-label="Options"
                    icon={
                      <FaEllipsisH
                        style={{ color: "2F2F2F", fontSize: "18px" }}
                      />
                    }
                    variant="outline"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers;
