import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ChakraProvider,
  Heading,
  Center,
  Flex,
  Box,
  Spacer,
} from "@chakra-ui/react";

import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";

function App() {
  const [appointments, setAppointments] = useState(null);

  const getAppointments = () => {
    axios.get("http://localhost:3000/appointments").then((response) => {
      // refresh the state of appointments with the recent data
      setAppointments(response.data);
    });
  };

  // getAppointments();
  useEffect(() => {
    getAppointments();
    // axios.get("http://localhost:3000/appointments").then((response) => {
    //   response.data.forEach((app) => {
    //     appointmentDates.push(new Date(app.appointmentDate));
    //   });
    // });
  }, []);

  return (
    <ChakraProvider>
      <Box bg="#orange.50" height="100vh">
        <Center>
          <Heading size="xl" mt="5" mb="5" color="##1a202c">
            Admin Panel Appointments
          </Heading>
        </Center>
        <Flex>
          <Box p="4" bg="blue.200" w="25%" ml="5" borderRadius="10">
            <AppointmentForm
              appointments={appointments}
              getAppointments={getAppointments}
              setAppointments={setAppointments}
            ></AppointmentForm>
          </Box>
          <Spacer></Spacer>
          <Box
            p="4"
            bg="gray.500"
            color="white"
            w="70%"
            mr="5"
            borderRadius="10"
          >
            <AppointmentList
              appointments={appointments}
              getAppointments={getAppointments}
              setAppointments={setAppointments}
            ></AppointmentList>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
