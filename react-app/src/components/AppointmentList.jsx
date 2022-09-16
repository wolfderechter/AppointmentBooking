import { useState, useEffect } from "react";
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import Alert from "./Alert";

function AppointmentList({ appointments, getAppointments, setAppointments }) {
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const cancelAppointment = (id) => {
    axios
      .delete(`http://localhost:3000/appointments/${id}`)
      .then(() => {
        getAppointments();
        setSuccessMsg(`Appointment successfully cancelled`);
      })
      .catch((error) => {
        //request unsuccessful
        //banner with error
        setErrorMsg(
          `Appointment could not be canceled: ${error.response.data.message}`
        );
      });

    setTimeout(() => {
      setSuccessMsg(false);
    }, 5000);
  };
  return (
    <div>
      <Center>
        <Heading size="lg" color="#001A23">
          List of appointments
        </Heading>
      </Center>
      {successMsg && (
        <Alert type="success">
          <h4>{successMsg}</h4>
        </Alert>
      )}
      {errorMsg && (
        <Alert type="error">
          <h4>{errorMsg}</h4>
        </Alert>
      )}
      <Table variant="simple" size="md" mt="5">
        <Thead>
          <Tr>
            <Th color="grey.50" fontSize="l">
              Appointment Date
            </Th>
            <Th color="grey.50" fontSize="l">
              Name
            </Th>
            <Th color="grey.50" fontSize="l">
              Email
            </Th>
            <Th color="grey.50" fontSize="l">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {appointments?.map((app) => (
            <Tr key={app.appointmentDate}>
              <Td>{new Date(app.appointmentDate).toDateString()}</Td>
              <Td>{app.name}</Td>
              <Td>{app.email}</Td>
              <Td>
                <Button
                  color="blue.700"
                  onClick={() => cancelAppointment(app._id)}
                >
                  Cancel Appointment
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default AppointmentList;
