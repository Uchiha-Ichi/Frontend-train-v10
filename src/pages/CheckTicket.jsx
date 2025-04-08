import {
  Box,
  Heading,
  Button,
  Input,
  Text,
  Flex,
  Stack,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
export default function CheckTicket() {
  const [checkType, setCheckType] = useState("ticketId");
  const [ticketId, setTicketId] = useState("");
  const [cccd, setCccd] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketList, setTicketList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setTicketId("");
    setCccd("");
    setPhone("");
    setTicketList([]);
    setError("");
  }, [checkType]);

  const handleCheckTicket = async () => {
    setError("");
    setTicketList([]);

    let apiUrl = "";
    if (checkType === "ticketId") {
      if (!ticketId) {
        setError("Vui lòng nhập mã vé!");
        return;
      }
      apiUrl = `http://localhost:8088/api/tickets/${ticketId}`;
    } else {
      if (!cccd || !phone) {
        setError("Vui lòng nhập cả CCCD và số điện thoại!");
        return;
      }
      apiUrl = `http://localhost:8088/api/tickets/user?cccd=${cccd}&phone=${phone}`;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Không tìm thấy vé!");

      const data = await response.json();
      console.log("Dữ liệu API trả về:", data);

      if (checkType === "ticketId") {
        setTicketList(data ? [data] : []);
      } else {
        if (Array.isArray(data) && data.length > 0) {
          setTicketList(data);
        } else {
          setError("Không tìm thấy vé!");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getTicketStatus = (status) => {
    switch (status) {
      case "1":
        return "Đã đặt";
      case "2":
        return "Đã thanh toán";
      case "3":
        return "Đã sử dụng";
      case "4":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };
  return (
    <Box
      maxW="1000px"
      mx="auto"
      my={10}
      p={6}
      bg="white"
      borderRadius="10px"
      boxShadow="md"
      textAlign="center"
    >
      <Heading size="md" mb={5}>
        Kiểm tra vé
      </Heading>

      <Flex justify="center" gap={4} mb={6}>
        <Button
          variant={checkType === "ticketId" ? "solid" : "outline"}
          colorScheme={checkType === "ticketId" ? "blue" : "gray"}
          onClick={() => setCheckType("ticketId")}
        >
          Kiểm tra bằng mã vé
        </Button>
        <Button
          variant={checkType === "userInfo" ? "solid" : "outline"}
          colorScheme={checkType === "userInfo" ? "blue" : "gray"}
          onClick={() => setCheckType("userInfo")}
        >
          Kiểm tra bằng thông tin khách hàng
        </Button>
      </Flex>

      <Stack spacing={4} mb={6}>
        {checkType === "ticketId" ? (
          <Input
            placeholder="Nhập mã vé"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
        ) : (
          <>
            <Input
              placeholder="Nhập CCCD"
              value={cccd}
              onChange={(e) => setCccd(e.target.value)}
            />
            <Input
              placeholder="Nhập Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}
        <Button colorScheme="blue" onClick={handleCheckTicket}>
          Kiểm tra
        </Button>
      </Stack>

      {error && (
        <Text color="red.500" fontSize="sm" mb={4}>
          {error}
        </Text>
      )}

      {ticketList.length > 0 && (
        <Box mt={8} textAlign="left" bg="gray.50" p={5} borderRadius="md">
          <Heading size="sm" mb={4}>
            Danh sách vé
          </Heading>
          {ticketList.map((ticket, index) => (
            <Box key={index} mb={6}>
              {checkType === "userInfo" && (
                <Heading size="xs" mb={2}>
                  Vé {index + 1}
                </Heading>
              )}
              <Text>
                <strong>Mã vé:</strong> {ticket.ticketId}
              </Text>
              <Text>
                <strong>Hành khách:</strong>{" "}
                {ticket.passenger?.fullname || "Không có dữ liệu"}
              </Text>
              <Text>
                <strong>Tên tàu:</strong>{" "}
                {ticket.trip?.train?.trainName || "Không có dữ liệu"}
              </Text>
              <Text>
                <strong>Giờ khởi hành:</strong>{" "}
                {ticket.trip?.tripDate
                  ? `${new Date(ticket.trip.tripDate).toLocaleDateString("vi-VN")} - ${ticket.trip?.train?.departureTime || "Chưa có giờ"}`
                  : "Không có dữ liệu"}
              </Text>
              <Text>
                <strong>Vị trí ghế:</strong>{" "}
                {ticket.seat?.seatNumber || "?"}
                {" - Tầng " + (ticket.seat?.level || "?")}
                {" - Toa " + (ticket.seat?.carriageList?.carriageListId || "?")}
                {" - Khoang " + (ticket.seat?.carriageList?.compartment?.compartmentName || "?")}
              </Text>
              <Text>
                <strong>Giá:</strong>{" "}
                {ticket.totalPrice
                  ? `${ticket.totalPrice} VND`
                  : "Chưa có giá"}
              </Text>
              <Text>
                <strong>Ga đi:</strong>{" "}
                {ticket.departureStation?.stationName || "Không có dữ liệu"}
              </Text>
              <Text>
                <strong>Ga đến:</strong>{" "}
                {ticket.arrivalStation?.stationName || "Không có dữ liệu"}
              </Text>
              <Text>
                <strong>Trạng thái vé:</strong>{" "}
                {getTicketStatus(ticket.ticketStatus)}
              </Text>
              <Divider my={4} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
