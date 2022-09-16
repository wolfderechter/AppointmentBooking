import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "./Alert";
import {
  Heading,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Center,
  Box,
} from "@chakra-ui/react";

function AppointmentForm({ setAppointments, appointments, getAppointments }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  let appointmentDates = [];

  const getAppointmentss = () => {
    axios.get("http://localhost:3000/appointments").then((response) => {
      //refresh the state of appointments with the recent data
      setAppointments(response.data);
      appointmentDates = [];
      response.data.forEach((app) => {
        appointmentDates.push(new Date(app.appointmentDate));
      });
      console.log(appointmentDates);
    });
  };

  //Create an appointment object and send api call to backend to create it
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    const appointmentObject = {
      appointmentDate: appointmentDate,
      name: name,
      email: email,
    };

    axios
      .post("http://localhost:3000/appointments", appointmentObject)
      .then((response) => {
        //request successful
        //banner with success
        setSuccessMsg(
          `Successfully booked an appointment on ${new Date(
            appointmentDate
          ).toDateString()}`
        );

        setTimeout(() => {
          setSuccessMsg(false);
        }, 5000);

        //clear form
        setName("");
        setEmail("");
        setAppointmentDate("");

        //refresh booked appointments
        getAppointments();
      })
      .catch((error) => {
        //request unsuccessful
        //banner with error
        setErrorMsg(
          `Appointment could not be created: ${error.response.data.message}`
        );

        setTimeout(() => {
          setErrorMsg(false);
        }, 5000);
      });
  };

  //this will check if name, email and appointment is empty
  //if empty the isError will be set to true and the submit button will be disabled untill all fields are filled
  const isError = name === "" || email === "" || appointmentDate === "";

  return (
    <>
      <Heading size="lg" mb="5" color="#001A23">
        Book your appointment
      </Heading>
      <Center>
        <FormControl onSubmit={handleSubmit} isInvalid={isError}>
          {errorMsg && <Alert type="error" message={errorMsg}></Alert>}
          {successMsg && (
            <Alert type="success">
              <h4>{successMsg}</h4>
            </Alert>
          )}
          <Center>
            <FormLabel>Date</FormLabel>
          </Center>

          <Center>
            <Box>
              <DatePicker
                placeholderText="Pick a date"
                selected={appointmentDate}
                onChange={(date) => {
                  setAppointmentDate(date);
                }}
                minDate={new Date()}
                excludeDates={appointments?.map((app) => {
                  return new Date(app.appointmentDate);
                })}
                dateFormat="dd/MM/yyyy"
              />
            </Box>
            {!isError ? (
              ""
            ) : (
              <FormErrorMessage ml="2" pos="absolute" left="60px">
                *
              </FormErrorMessage>
            )}
          </Center>

          <Center>
            <FormLabel>Name</FormLabel>
          </Center>
          <Center>
            <input
              placeholder="Your Name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {!isError ? (
              ""
            ) : (
              <FormErrorMessage ml="2" pos="absolute" left="60px">
                *
              </FormErrorMessage>
            )}
          </Center>

          <Center>
            <FormLabel>Email</FormLabel>
          </Center>
          <Center>
            <input
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isError ? (
              ""
            ) : (
              <FormErrorMessage ml="2" pos="absolute" left="60px">
                *
              </FormErrorMessage>
            )}
          </Center>

          <Center>
            <Button
              type="submit"
              color="orange.300"
              bg="gray.100"
              m="5"
              _hover={{ color: "white", bg: "orange.300" }}
              disabled={isError}
              onClick={handleSubmit}
            >
              Make Appointment
            </Button>
          </Center>
        </FormControl>
      </Center>
    </>
  );
}

export default AppointmentForm;
