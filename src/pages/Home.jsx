import React, { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Flex, Container, Button, Stack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import { RouteContext } from "../store/RouteContext";
import Calendar from "../components/Calendar/Calendar";
import DatePicker from "../components/DatePicker/DatePicker";
import Input from "../components/Input/Input";
import StationAutocomplete from "../utils/StationAutoComplete";
import { featchTicketType } from "../redux/ticketType";

const SearchForm = ({ state, handleFromChange, handleToChange, stations }) => (
  <Stack gap="4" align="flex-start">
    <StationAutocomplete
      label="Ga đi"
      value={state.from}
      onChange={handleFromChange}
      options={stations}
    />
    <StationAutocomplete
      label="Ga đến"
      value={state.to}
      onChange={handleToChange}
      options={stations}
    />
    <Button
      as={Link}
      to="/booking"
      // variant="ghost"
      _hover={{ textDecoration: "underline" }}
      _after={{
        content: '""',
        display: "block",
        height: "2px",
        bg: "black",
        transition: "width 0.3s",
      }}
    >
      Tìm kiếm
    </Button>
  </Stack>
);

// Home component
export default function Home() {
  const dispatch = useDispatch();

  const { state, handleSetFrom, handleSetTo, handleSetDate } =
    useContext(RouteContext);

  const [stations, setStations] = useState([]);

  const handleFromChange = (e) => handleSetFrom(e.target.value);
  const handleToChange = (e) => handleSetTo(e.target.value);
  const handleDateChange = (date) => handleSetDate(date);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/station/all");
        if (!response.ok) {
          toast.error("Can't fetch all the stations", {
            position: "bottom-right",
            autoClose: 4000,
          });
          return;
        }

        const data = await response.json();
        const stationData = data.map((station) => ({
          stationId: station.stationId,
          stationName: station.stationName,
        }));
        setStations(stationData);

        // toast.success("Fetched all stations", {
        //   position: "bottom-right",
        //   autoClose: 4000,
        // });
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    dispatch(featchTicketType());

    fetchStations();
  }, []);

  return (
    <Container maxW="container.xl" p={16}>
      <ToastContainer />

      {/* Desktop view */}
      <Flex display={{ base: "none", md: "flex" }} gap="16" justify="center">
        <Calendar onDateChange={handleDateChange} />
        <SearchForm
          state={state}
          handleFromChange={handleFromChange}
          handleToChange={handleToChange}
          stations={stations}
        />
      </Flex>

      {/* Mobile view */}
      <Flex display={{ base: "flex", md: "none" }} direction="column">
        <DatePicker onChange={handleDateChange} />
        <SearchForm
          state={state}
          handleFromChange={handleFromChange}
          handleToChange={handleToChange}
        />
      </Flex>
    </Container>
  );
}