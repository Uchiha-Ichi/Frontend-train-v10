import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { featchTicketType } from "../redux/ticketType";
import {
  Box,
  Flex,
  Heading,
  Text,
  Select,
  Input,
  Button,
  Table,
  Portal,
  HStack, Stack, VStack,
  createListCollection
} from "@chakra-ui/react";

import { groupBy } from "es-toolkit"
// import { DeleteIcon } from "@chakra-ui/icons";
// import { bookTickets, testTicket } from "../../redux/ticketSlice";
export default function Infomation() {
  // const dispatch = useDispatch();
  const selectedSeats = useSelector((state) => state.seat.selectedSeats);

  const { types, loading, error } = useSelector((state) => state.ticketType);
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    cccd: "",
    email: "",
  });
  const [tickets, setTickets] = useState([]);


  // const getPrice = (reservation) => {
  //   let price = 0;
  //   price = reservation.seat * reservation.seat.car
  //   return
  // }
  useEffect(() => {
    console.log("here");
    if (selectedSeats?.length > 0) {
      setTickets(
        selectedSeats.map((selectedSeat) => ({
          fullName: "",
          cccd: "",
          price: selectedSeat.ticketPrice,
          discount: 0,
          totalPrice: selectedSeat.ticketPrice,
          ticketReservation: selectedSeat.reservation,
          ticketType: types[1],
        }))
      );
    }
  }, []);


  const handlePay = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        customerDTO: customerInfo,
        ticketInformationDTO: tickets,
      };

      const totalAmount = getTotalAmount() || 0;;
      let requestData = { customer: customerInfo.fullName, amount: totalAmount / 1000 };
      console.log("reqData", requestData);
      const response = await axios.post("http://localhost:5000/payment", requestData,
        { headers: { "Content-Type": "application/json" } });

      if (response.data && response.data.resultCode === 0) {
        localStorage.setItem("payload", JSON.stringify(payload));

        window.location.href = response.data.payUrl;

      } else {
        console.error("Thanh toán thất bại:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thanh toán:", error);
    }
  };

  const handlePrice = (category, index) => {
    // console.log("category", category.value);
    let newPrice = selectedSeats[index].ticketPrice; // Giá mặc định
    let newDiscount = 0;
    let idType = 0;
    if (category.value[0] === "Trẻ em") {
      idType = 1;
      newDiscount = 0.5;
      newPrice = selectedSeats[index].ticketPrice * (1 - newDiscount);
    } else if (category.value[0] === "Sinh viên") {
      idType = 3;
      newDiscount = 0.1
      newPrice = selectedSeats[index].ticketPrice * (1 - newDiscount);
    } else if (category.value[0] === "Người cao tuổi") {
      idType = 2;
      newDiscount = 0.3
      newPrice = selectedSeats[index].ticketPrice * (1 - newDiscount);
    }

    // Cập nhật giá cho vé tương ứng
    setTickets((prevTickets) => {
      const updatedTickets = [...prevTickets];
      updatedTickets[index] = { ...updatedTickets[index], totalPrice: newPrice };
      updatedTickets[index] = { ...updatedTickets[index], discount: newDiscount };
      updatedTickets[index] = { ...updatedTickets[index], ticketType: types[idType] };
      return updatedTickets;
    });
  };
  console.log(types);

  const collection = createListCollection({
    items: types.map(type => ({
      label: type.ticketTypeName,
      value: type.ticketTypeName,
      discountRate: type.discountRate
    })),
    // items: [
    //   { label: "Naruto", value: "naruto", category: "Anime" },
    //   { label: "One Piece", value: "one-piece", category: "Anime" },
    //   { label: "Dragon Ball", value: "dragon-ball", category: "Anime" },
    //   {
    //     label: "The Shawshank Redemption",
    //     value: "the-shawshank-redemption",
    //     category: "Movies",
    //   },
    //   { label: "The Godfather", value: "the-godfather", category: "Movies" },
    //   { label: "The Dark Knight", value: "the-dark-knight", category: "Movies" },
    // ],
  })
  const getTotalAmount = () => {
    return tickets.reduce((sum, ticket) => sum + (ticket?.totalPrice || 0), 0);
  };
  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading size="md" mb={4}>Danh sách vé đã chọn</Heading>
      <Table.Root variant="simple" size="sm">
        <Table.Header bg="gray.100">
          <Table.Row>
            <Table.Cell>Họ tên</Table.Cell>
            <Table.Cell>Thông tin chỗ</Table.Cell>
            <Table.Cell>Giá vé</Table.Cell>
            <Table.Cell>Giảm đối tượng</Table.Cell>
            <Table.Cell>Thành tiền (VNĐ)</Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {selectedSeats.map((selectedSeat, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <VStack spacing={1} align="start">
                  <Input placeholder="Họ tên" size="sm" value={tickets[index]?.fullName || ""}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[index].fullName = e.target.value;
                      setTickets(newTickets);
                    }} />

                  <Select.Root collection={collection} size="sm" width="320px" onValueChange={(value) => handlePrice(value, index)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Chọn đối tượng" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          <Select.ItemGroup>
                            {collection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.ItemGroup>

                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                  <Input placeholder="Số giấy tờ" size="sm" value={tickets[index]?.cccd || ""}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[index].cccd = e.target.value;
                      setTickets(newTickets);
                    }} />
                </VStack>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{selectedSeat.reservation.trip.train.trainName}, {selectedSeat.reservation.trip.train.route.routeName}</Text>
                <Text fontSize="sm">{selectedSeat.reservation.trip.tripDate}</Text>
                <Text fontSize="sm">Toa {selectedSeat.stt} - Ghế {selectedSeat.seatName}</Text>
              </Table.Cell>
              <Table.Cell>{selectedSeat.ticketPrice.toLocaleString()} VND</Table.Cell>
              <Table.Cell>Giảm {(tickets[index]?.discount * 100).toString()} %</Table.Cell>

              <Table.Cell>{tickets[index]?.totalPrice.toLocaleString()} VND</Table.Cell>
              <Table.Cell><Button bg="gray.500" cursor="pointer" /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="flex-end" my={4} align="center" gap={2}>
        <Button size="sm" colorScheme="gray">Xóa tất cả các vé</Button>
        {/* <Input placeholder="Nhập mã giảm giá" size="sm" width="200px" />
        <Button size="sm" colorScheme="blue">Áp dụng</Button> */}
      </Flex>

      <Flex justify="flex-end" mb={6}>
        <Text fontWeight="bold">Tổng tiền:&nbsp;</Text>
        <Text fontWeight="bold" color="blue.600">{getTotalAmount().toLocaleString() || "0"} VND</Text>
      </Flex>

      <Box borderTop="1px" borderColor="gray.300" pt={4}>
        <Heading size="sm" mb={2} color="orange.500">Thông tin người đặt vé</Heading>
        <Text fontSize="sm" mb={4}>
          Quý khách vui lòng điền đầy đủ và chính xác các thông tin về người mua vé dưới đây...
        </Text>
        <Flex flexWrap="wrap" gap={4}>
          <Input placeholder="Họ và tên*" width="300px" value={customerInfo?.fullName || ""}
            onChange={(e) => {
              setCustomerInfo((prev) => {
                const newState = { ...prev, fullName: e.target.value };
                return newState;
              });
            }} />
          <Input placeholder="Số CMND/Hộ chiếu*" width="300px" value={customerInfo?.cccd || ""}
            onChange={(e) => setCustomerInfo({ ...customerInfo, cccd: e.target.value })} />
          <Input placeholder="Email để nhận vé điện tử*" width="300px" value={customerInfo?.email || ""}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
          <Input placeholder="Số di động*" width="300px" value={customerInfo?.phone || ""}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
        </Flex>
        <Flex justify="flex-end" my={4} align="center" gap={2}>
          <Button size="sm" colorScheme="gray" onClick={handlePay} >Thanh Toán</Button>
          {/* <Input placeholder="Nhập mã giảm giá" size="sm" width="200px" />
        <Button size="sm" colorScheme="blue">Áp dụng</Button> */}
        </Flex>
      </Box>
    </Box>
  );
}
