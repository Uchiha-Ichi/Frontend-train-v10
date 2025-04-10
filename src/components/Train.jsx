import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text, Flex, Button, VStack, HStack } from "@chakra-ui/react";
import {
  reserveTicket,
  deleteReserveTicket,
} from "../redux/ticketReservationSlice";
import { selectSeat } from "../redux/seatSlice";
import { ToastContainer, toast } from "react-toastify";

const Seat = ({ id, available, isSelected, onClick }) => {
  return (
    <Button
      onClick={available ? onClick : null}
      id={id}
      width="40px"
      height="40px"
      backgroundColor={
        available ? (isSelected ? "green.400" : "tomato") : "gray.400"
      }
      border="1px solid black"
      margin="5px"
      cursor={available ? "pointer" : "not-allowed"}
      _hover={available ? { opacity: 0.8 } : {}}
    >
      {/* Optional: Seat number or icon */}
    </Button>
  );
};

const Car = ({
  type,
  carIndex,
  numSeats,
  carsConfig,
  stt,

}) => {
  const dispatch = useDispatch();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const seats = [];
  const currentTrip = useSelector((state) => state.stationSearch.currentTrip);
  const seatsInCol = type === "Giường nằm khoang 6 điều hòa" ? 3 : 2;
  const seatsClusterLength = type === "seat" ? 32 : type === "sleep4" ? 28 : 42;

  const handleSelectSeat = async (seat) => {

    const isSelected = selectedSeat.some((s) => s.seatId === seat.seatId);
    const ticketReservationDTO = {
      seat: seat.seatId,
      trip: currentTrip.tripId,
      departureStation: currentTrip.departureStation,
      arrivalStation: currentTrip.arrivalStation,
    };

    if (isSelected) {
      setSelectedSeat((prev) => prev.filter((s) => s.seatId !== seat.seatId));
      console.log("currenttrip", currentTrip);
      await dispatch(deleteReserveTicket(ticketReservationDTO));
      dispatch(
        selectSeat({
          seatId: seat.seatId,
          seatName: seat.seatNumber,
          stt: stt,
          ticketPrice: seat.ticketPrice,
          reservation: null,
          departureTime: currentTrip.departureTime,
        })
      );
    } else {
      if (selectedSeat.length > 4) {
        toast.error("Chỉ được chọn tối đa 5 ghế", {
          position: "bottom-right",
          autoClose: 4000,
        });
        return;
      }
      const reservationResponse = await dispatch(
        reserveTicket(ticketReservationDTO)
      );
      const reservation = reservationResponse.payload;
      dispatch(
        selectSeat({
          seatId: seat.seatId,
          seatName: seat.seatNumber,
          stt: stt,
          ticketPrice: seat.ticketPrice,
          reservation: reservation,
          departureTime: currentTrip.departureTime
        })
      );
      setSelectedSeat((prev) => [...prev, seat]);
    }
  };

  for (let i = 0; i < numSeats; i++) {
    const seat = carsConfig[i];
    const isSelected = selectedSeat.some((s) => s.seatId === seat.seatId);
    seats.push(
      <Seat
        key={seat.seatId}
        available={seat.available}
        isSelected={!isSelected}
        onClick={() => handleSelectSeat(seat)}
      />
    );
  }

  function renderSeatCluster() {
    const cols = [];
    for (let i = 0; i < seatsClusterLength; i += seatsInCol) {
      cols.push(
        <VStack key={i} spacing={2} mb={4}>
          {Array.from({ length: seatsInCol }, (_, idx) =>
            seats[i + idx] ? <Box key={idx}>{seats[i + idx]}</Box> : null
          )}
        </VStack>
      );
    }
    return cols;
  }

  return (
    <>
      <ToastContainer />
      <Flex
        direction="column"
        border="2px solid"
        borderColor="gray.700"
        borderRadius="md"
        p={4}
        mb={8}
        alignItems="center"
      >
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Toa {carIndex + 1} - {type}
        </Text>

        <HStack spacing={6}>
          {renderSeatCluster()}
          <Box w="20px" />
          {type === "seat" && renderSeatCluster()}
        </HStack>
      </Flex></>
  );
};

export default function Train({
  trainConfig,

}) {
  return (
    <Flex direction="column" align="center" py={6} px={4}>
      {trainConfig.map((carConfig, carIndex) => (
        <Car
          key={carIndex}
          carIndex={carIndex}
          type={carConfig.compartmentName}
          numSeats={carConfig.seatCount}
          carsConfig={carConfig.seats}
          stt={carConfig.stt}
        />
      ))}
    </Flex>
  );
}
