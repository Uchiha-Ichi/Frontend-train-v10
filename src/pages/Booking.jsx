
// import React, { useEffect, useState, useContext, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {
//   Heading,
//   Box,
//   Text,
//   Container,
//   VStack,
//   Grid,
//   Spinner,
//   Card,
//   Button,
// } from "@chakra-ui/react";
// import { RouteContext } from "../store/RouteContext";
// import { searchTrains, setCurrentTrip } from "../redux/stationSearchSlice";
// import { fetchSeat } from "../redux/seatSlice";
// import Train from "../components/Train";
// import SeatCountdown from "../components/SeatCountdown/SeatCountdown";

// export default function BookingPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useContext(RouteContext);
//   const { from, to, date } = state;
//   const [activeTripId, setActiveTripId] = useState(null);
//   const lastSearch = useRef(null); // Track last search to prevent duplicates

//   const trips = useSelector((state) => state.stationSearch?.trips || []);
//   const loading = useSelector((state) => state.stationSearch?.loading);
//   const error = useSelector((state) => state.stationSearch?.error);
//   const carriages = useSelector((state) => state.seat.carriages);
//   const selectedSeats = useSelector((state) => state.seat.selectedSeats);
//   const totalPrice = useSelector((state) => state.seat.totalPrice);
//   const activeTrip = trips.find((trip) => trip.tripId === activeTripId);

//   const handleTransfer = () => {
//     if (selectedSeats.length === 0) {
//       toast.error("Vui lòng chọn ghế trước khi thanh toán !", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       return;
//     }
//     navigate("/info");
//   };

//   const formatTotalPrice = (totalPrice) => {
//     return totalPrice.toLocaleString("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     });
//   };

//   useEffect(() => {
//     // Validate inputs
//     if (!from || !to || !date) {
//       toast.dismiss(); // Clear any existing toasts
//       toast.error("Vui lòng nhập đầy đủ Ga đi, Ga đến và ngày đi", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//       return;
//     }

//     if (from === to) {
//       toast.dismiss(); // Clear any existing toasts
//       toast.error("Ga đi và Ga đến không được giống nhau!", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//       return;
//     }

//     // Check for duplicate search
//     const currentSearch = { from, to, date };
//     if (JSON.stringify(currentSearch) === JSON.stringify(lastSearch.current)) {
//       console.log("Skipping duplicate search:", currentSearch);
//       return;
//     }
//     lastSearch.current = currentSearch;

//     // Log input details for debugging
//     console.log("Search params:", { from, to, date });

//     toast.dismiss(); // Clear any existing toasts before new search
//     dispatch(searchTrains({ from, to, date }))
//       .unwrap()
//       .then(() => {
//         toast.success("Tải danh sách chuyến tàu thành công!", {
//           position: "bottom-right",
//           autoClose: 3000,
//         });
//       })
//       .catch((err) => {
//         const status = err.status || 500;
//         const message = err.message || "Lỗi khi tìm kiếm tàu";

//         console.error("Search error:", err);

//         if (status === 500 || message === "No trips found for the given stations and date") {
//           // 500: No trips found
//           toast.info("Không tìm thấy chuyến tàu, hiện tại chưa có", {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//         } else if (status === 400 || message === "Invalid date format") {
//           // 400: Invalid input
//           toast.error("Dữ liệu tìm kiếm không hợp lệ. Vui lòng kiểm tra lại!", {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//           // Do not redirect, allow user to stay and adjust search
//         } else {
//           // Other errors (e.g., server issues)
//           toast.error(`Lỗi khi tìm kiếm tàu: ${message}`, {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//           setTimeout(() => {
//             navigate("/");
//           }, 2000);
//         }
//       });
//   }, [dispatch, from, to, date, navigate]);

//   return (
//     <Box py={12} px={4}>
//       <ToastContainer />

//       {/* Hero Section */}
//       <Box textAlign="center" mb={10}>
//         <Heading size="xl" fontWeight="bold">
//           {from} → {to}
//         </Heading>
//         <Text mt={2} color="gray.600">
//           Ngày: {new Date(date).toLocaleDateString("vi-VN")}
//         </Text>
//       </Box>

//       <Container maxW="6xl">
//         {loading && (
//           <Box textAlign="center" my={8}>
//             <Spinner size="lg" />
//             <Text mt={2}>Đang tìm kiếm chuyến tàu...</Text>
//           </Box>
//         )}

//         {!loading && error && (
//           <Text color="red.500" textAlign="center" mb={6}>
//             {error.message === "No trips found for the given stations and date" ||
//             error.status === 500
//               ? "Không tìm thấy chuyến tàu, hiện tại chưa có"
//               : `Lỗi: ${error.message || error}`}
//           </Text>
//         )}

//         {!loading && !error && trips.length === 0 && (
//           <Text textAlign="center" mt={8}>
//             Không tìm thấy chuyến tàu, hiện tại chưa có
//           </Text>
//         )}

//         {!loading && trips.length > 0 && (
//           <Grid
//             templateColumns={{ base: "1fr", md: "1fr 3fr" }}
//             gap={6}
//             alignItems="flex-start"
//           >
//             <Box
//               overflowX={{ base: "auto", md: "visible" }}
//               whiteSpace={{ base: "nowrap", md: "normal" }}
//               display="flex"
//               flexDirection={{ base: "row", md: "column" }}
//               gap={4}
//               pb={{ base: 4, md: 0 }}
//             >
//               <Button
//                 onClick={handleTransfer}
//                 colorScheme="teal"
//                 size="lg"
//                 height="auto"
//                 display="block"
//                 textAlign="left"
//                 whiteSpace="normal"
//                 px={4}
//                 py={4}
//                 bg="blue.100"
//                 w="100%"
//                 borderColor="blue.600"
//                 color="black"
//                 isDisabled={selectedSeats.length === 0}
//               >
//                 <Box>
//                   {selectedSeats.length === 0 ? (
//                     <Text fontWeight="bold" color="gray.500">
//                       Chưa chọn vé nào
//                     </Text>
//                   ) : (
//                     <>
//                       {selectedSeats.map((seat, index) => (
//                         <Box
//                           key={index}
//                           p={2}
//                           mb={2}
//                           borderWidth="1px"
//                           borderRadius="md"
//                           bg="blue.200"
//                         >
//                           <Text fontWeight="bold">
//                             {seat.reservation.trainName}
//                           </Text>
//                           <Text>
//                             {seat.reservation.departureStation} -{" "}
//                             {seat.reservation.arrivalStation}
//                           </Text>
//                           <Text>{seat.departureTime}</Text>
//                           <Text>
//                             Toa {seat.stt} - Ghế {seat.seatName}
//                           </Text>
//                           <SeatCountdown expire={seat.expire} />
//                         </Box>
//                       ))}
//                       <Text fontWeight="bold">
//                         {selectedSeats.length} ghế đã chọn -{" "}
//                         {formatTotalPrice(totalPrice)}
//                       </Text>
//                     </>
//                   )}
//                 </Box>
//               </Button>
//               {trips.map((trip) => (
//                 <Card.Root
//                   key={trip.tripId}
//                   minW={{ base: "250px", md: "auto" }}
//                   borderWidth="2px"
//                   borderColor={
//                     trip.tripId === activeTripId ? "blue.500" : "gray.200"
//                   }
//                   bg={trip.tripId === activeTripId ? "blue.50" : "white"}
//                   cursor="pointer"
//                   onClick={() => {
//                     setActiveTripId(trip.tripId);
//                     dispatch(setCurrentTrip(trip));
//                     dispatch(
//                       fetchSeat({
//                         tripId: trip.tripId,
//                         from: trip.departureStation,
//                         to: trip.arrivalStation,
//                       })
//                     )
//                       .unwrap()
//                       .then(() => {
//                         // toast.success("Tải thông tin toa tàu thành công!", {
//                         //   position: "bottom-right",
//                         //   autoClose: 3000,
//                         // });
//                       })
//                       .catch((err) => {
//                         toast.error(`Lỗi khi tải toa tàu: ${err}`, {
//                           position: "bottom-right",
//                           autoClose: 4000,
//                         });
//                       });
//                   }}
//                   transition="all 0.2s"
//                   _hover={{ shadow: "md" }}
//                 >
//                   <Card.Header>
//                     <Box bg="blue.500" color="white" px={3} py={1} borderRadius="md">
//                       <Heading size="md">
//                         Tàu: {trip.trainName || "Chưa rõ"}
//                       </Heading>
//                     </Box>
//                   </Card.Header>

//                   <Card.Body>
//                     <VStack align="start" spacing={2}>
//                       <Text>
//                         Thời gian đi:{" "}
//                         {new Date(trip.departureTime).toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </Text>

//                       <Text>
//                         Thời gian đến:{" "}
//                         {new Date(trip.arrivalTime).toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </Text>

//                       <Box bg="green.500" color="white" px={3} py={1} borderRadius="md">
//                         <Text>Số ghế còn lại: {trip.availableSeats}</Text>
//                       </Box>
//                     </VStack>
//                   </Card.Body>
//                 </Card.Root>
//               ))}
//             </Box>

//             {activeTrip && (
//               <Box>
//                 <Train trainConfig={carriages} />
//               </Box>
//             )}
//           </Grid>
//         )}
//       </Container>
//     </Box>
//   );
// }





import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Heading,
  Box,
  Text,
  Container,
  VStack,
  Grid,
  Spinner,
  Card,
  Button,
} from "@chakra-ui/react";
import { RouteContext } from "../store/RouteContext";
import { searchTrains, setCurrentTrip, resetSearch } from "../redux/stationSearchSlice";
import { fetchSeat } from "../redux/seatSlice";
import Train from "../components/Train";
import SeatCountdown from "../components/SeatCountdown/SeatCountdown";

export default function BookingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useContext(RouteContext);
  const { from, to, date } = state;
  const [activeTripId, setActiveTripId] = useState(null);

  const trips = useSelector((state) => state.stationSearch?.trips || []);
  const loading = useSelector((state) => state.stationSearch?.loading);
  const error = useSelector((state) => state.stationSearch?.error);
  const carriages = useSelector((state) => state.seat.carriages);
  const selectedSeats = useSelector((state) => state.seat.selectedSeats);
  const totalPrice = useSelector((state) => state.seat.totalPrice);
  const activeTrip = trips.find((trip) => trip.tripId === activeTripId);

  const handleTransfer = () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế trước khi thanh toán !", {
        position: "bottom-right",
        autoClose: 4000,
      });
      return;
    }
    navigate("/info");
  };

  const formatTotalPrice = (totalPrice) => {
    return totalPrice.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    // Validate inputs
    if (!from || !to || !date) {
      toast.error("Vui lòng nhập đầy đủ Ga đi, Ga đến và ngày đi", {
        position: "bottom-right",
        autoClose: 4000,
      });
      setTimeout(() => {
        dispatch(resetSearch());
        navigate("/");
      }, 2000);
      return;
    }

    if (from === to) {
      toast.error("Ga đi và Ga đến không được giống nhau!", {
        position: "bottom-right",
        autoClose: 4000,
      });
      setTimeout(() => {
        dispatch(resetSearch());
        navigate("/");
      }, 2000);
      return;
    }

    // Log input details for debugging
    console.log("Search params:", { from, to, date });

    dispatch(searchTrains({ from, to, date }))
      .unwrap()
      .then(() => {
        toast.success("Tải danh sách chuyến tàu thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        const status = err.status || 500;
        const message = err.message || "Lỗi khi tìm kiếm tàu";

        console.error("Search error:", err);

        if (status === 500 || message === "No trips found for the given stations and date") {
          // 500: No trips found
          toast.info("Không tìm thấy chuyến tàu, hiện tại chưa có", {
            position: "bottom-right",
            autoClose: 4000,
          });
          setTimeout(() => {
            // Reset search state
            navigate("/");
          }, 2000);
        } else if (status === 400 || message === "Invalid date format") {
          // 400: Invalid input
          toast.error("Dữ liệu tìm kiếm không hợp lệ. Vui lòng kiểm tra lại!", {
            position: "bottom-right",
            autoClose: 4000,
          });
          // Do not redirect, allow user to stay and adjust search
        } else {
          // Other errors (e.g., server issues)
          toast.error(`Lỗi khi tìm kiếm tàu: ${message}`, {
            position: "bottom-right",
            autoClose: 4000,
          });
          setTimeout(() => {
            dispatch(resetSearch()); // Reset search state
            navigate("/");
          }, 2000);
        }
      });
  }, [dispatch, from, to, date, navigate]);

  return (
    <Box py={12} px={4}>
      <ToastContainer />

      {/* Hero Section */}
      <Box textAlign="center" mb={10}>
        <Heading size="xl" fontWeight="bold">
          {from} → {to}
        </Heading>
        <Text mt={2} color="gray.600">
          Ngày: {new Date(date).toLocaleDateString("vi-VN")}
        </Text>
      </Box>

      <Container maxW="6xl">
        {loading && (
          <Box textAlign="center" my={8}>
            <Spinner size="lg" />
            <Text mt={2}>Đang tìm kiếm chuyến tàu...</Text>
          </Box>
        )}

        {!loading && error && (
          <Text color="red.500" textAlign="center" mb={6}>
            {error.message === "No trips found for the given stations and date" ||
              error.status === 500
              ? "Không tìm thấy chuyến tàu, hiện tại chưa có"
              : `Lỗi: ${error.message || error}`}
          </Text>
        )}

        {!loading && !error && trips.length === 0 && (
          <Text textAlign="center" mt={8}>
            Không tìm thấy chuyến tàu, hiện tại chưa có
          </Text>
        )}

        {!loading && trips.length > 0 && (
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 3fr" }}
            gap={6}
            alignItems="flex-start"
          >
            <Box
              overflowX={{ base: "auto", md: "visible" }}
              whiteSpace={{ base: "nowrap", md: "normal" }}
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={4}
              pb={{ base: 4, md: 0 }}
            >
              <Button
                onClick={handleTransfer}
                colorScheme="teal"
                size="lg"
                height="auto"
                display="block"
                textAlign="left"
                whiteSpace="normal"
                px={4}
                py={4}
                bg="blue.100"
                w="100%"
                borderColor="blue.600"
                color="black"
                isDisabled={selectedSeats.length === 0}
              >
                <Box>
                  {selectedSeats.length === 0 ? (
                    <Text fontWeight="bold" color="gray.500">
                      Chưa chọn vé nào
                    </Text>
                  ) : (
                    <>
                      {selectedSeats.map((seat, index) => (
                        <Box
                          key={index}
                          p={2}
                          mb={2}
                          borderWidth="1px"
                          borderRadius="md"
                          bg="blue.200"
                        >
                          <Text fontWeight="bold">
                            {seat.reservation.trainName}
                          </Text>
                          <Text>
                            {seat.reservation.departureStation} -{" "}
                            {seat.reservation.arrivalStation}
                          </Text>
                          <Text>{seat.departureTime}</Text>
                          <Text>
                            Toa {seat.stt} - Ghế {seat.seatName}
                          </Text>
                          <SeatCountdown expire={seat.expire} />
                        </Box>
                      ))}
                      <Text fontWeight="bold">
                        {selectedSeats.length} ghế đã chọn -{" "}
                        {formatTotalPrice(totalPrice)}
                      </Text>
                    </>
                  )}
                </Box>
              </Button>
              {trips.map((trip) => (
                <Card.Root
                  key={trip.tripId}
                  minW={{ base: "250px", md: "auto" }}
                  borderWidth="2px"
                  borderColor={
                    trip.tripId === activeTripId ? "blue.500" : "gray.200"
                  }
                  bg={trip.tripId === activeTripId ? "blue.50" : "white"}
                  cursor="pointer"
                  onClick={() => {
                    setActiveTripId(trip.tripId);
                    dispatch(setCurrentTrip(trip));
                    dispatch(
                      fetchSeat({
                        tripId: trip.tripId,
                        from: trip.departureStation,
                        to: trip.arrivalStation,
                      })
                    )
                      .unwrap()
                      .then(() => {
                        // toast.success("Tải thông tin toa tàu thành công!", {
                        //   position: "bottom-right",
                        //   autoClose: 3000,
                        // });
                      })
                      .catch((err) => {
                        toast.error(`Lỗi khi tải toa tàu: ${err}`, {
                          position: "bottom-right",
                          autoClose: 4000,
                        });
                      });
                  }}
                  transition="all 0.2s"
                  _hover={{ shadow: "md" }}
                >
                  <Card.Header>
                    <Box bg="blue.500" color="white" px={3} py={1} borderRadius="md">
                      <Heading size="md">
                        Tàu: {trip.trainName || "Chưa rõ"}
                      </Heading>
                    </Box>
                  </Card.Header>

                  <Card.Body>
                    <VStack align="start" spacing={2}>
                      <Text>
                        Thời gian đi:{" "}
                        {new Date(trip.departureTime).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Text>

                      <Text>
                        Thời gian đến:{" "}
                        {new Date(trip.arrivalTime).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Text>

                      <Box bg="green.500" color="white" px={3} py={1} borderRadius="md">
                        <Text>Số ghế còn lại: {trip.availableSeats}</Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Box>

            {activeTrip && (
              <Box>
                <Train trainConfig={carriages} />
              </Box>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}







//----------------------------------------------------



// import React, { useEffect, useState, useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {
//   Heading,
//   Box,
//   Text,
//   Container,
//   VStack,
//   Grid,
//   Spinner,
//   Card,
//   Button,
// } from "@chakra-ui/react";
// import { RouteContext } from "../store/RouteContext";
// import { searchTrains, setCurrentTrip } from "../redux/stationSearchSlice";
// import { fetchSeat } from "../redux/seatSlice";
// import Train from "../components/Train";
// import SeatCountdown from "../components/SeatCountdown/SeatCountdown";

// export default function BookingPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useContext(RouteContext);
//   const { from, to, date } = state;
//   const [activeTripId, setActiveTripId] = useState(null);

//   // Use "trips" consistently
//   const trips = useSelector((state) => state.stationSearch?.trips || []);
//   const loading = useSelector((state) => state.stationSearch?.loading);
//   const error = useSelector((state) => state.stationSearch?.error);
//   const carriages = useSelector((state) => state.seat.carriages);
//   const selectedSeats = useSelector((state) => state.seat.selectedSeats);
//   const totalPrice = useSelector((state) => state.seat.totalPrice);
//   const activeTrip = trips.find((trip) => trip.tripId === activeTripId);

//   const handleTransfer = () => {
//     if (selectedSeats.length === 0) {
//       toast.error("Vui lòng chọn ghế trước khi thanh toán !", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       return;
//     }
//     navigate("/info");
//   };

//   const formatTotalPrice = (totalPrice) => {
//     return totalPrice.toLocaleString("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     });
//   };

//   useEffect(() => {
//     console.log("from: ", state.from, ", to: ", state.to, ", date", state.date);
//     if (from && to && date) {
//       dispatch(searchTrains({ from, to, date }))
//         .unwrap()
//         .then(() => {
//           toast.success("Tải danh sách chuyến tàu thành công!", {
//             position: "bottom-right",
//             autoClose: 3000,
//           });
//         })
//         .catch((err) => {
//           if (err === "No trips found for the given stations and date") {
//             // Handle 500 status (no trips found)
//             toast.info("Không tìm thấy chuyến tàu, hiện tại chưa có", {
//               position: "bottom-right",
//               autoClose: 4000,
//             });
//           } else {
//             // Handle other errors (e.g., 400)
//             toast.error(`Lỗi khi tải chuyến tàu: ${err}`, {
//               position: "bottom-right",
//               autoClose: 4000,
//             });
//             setTimeout(() => {
//               navigate("/");
//             }, 2000);
//           }
//         });
//     }
//   }, [dispatch, from, to, date]);

//   return (
//     <Box py={12} px={4}>
//       <ToastContainer />

//       {/* Hero Section */}
//       <Box textAlign="center" mb={10}>
//         <Heading size="xl" fontWeight="bold">
//           {from} → {to}
//         </Heading>
//         <Text mt={2} color="gray.600">
//           Ngày: {date}
//         </Text>
//       </Box>

//       <Container maxW="6xl">
//         {loading && (
//           <Box textAlign="center" my={8}>
//             <Spinner size="lg" />
//             <Text mt={2}>Đang tìm kiếm chuyến tàu...</Text>
//           </Box>
//         )}

//         {!loading && error && (
//           <Text color="red.500" textAlign="center" mb={6}>
//             {error === "No trips found for the given stations and date"
//               ? "Không tìm thấy chuyến tàu, hiện tại chưa có"
//               : `Lỗi: ${error}`}
//           </Text>
//         )}

//         {!loading && !error && trips.length === 0 && (
//           <Text textAlign="center" mt={8}>
//             Không tìm thấy chuyến tàu, hiện tại chưa có
//           </Text>
//         )}

//         {!loading && trips.length > 0 && (
//           <Grid
//             templateColumns={{ base: "1fr", md: "1fr 3fr" }}
//             gap={6}
//             alignItems="flex-start"
//           >
//             <Box
//               overflowX={{ base: "auto", md: "visible" }}
//               whiteSpace={{ base: "nowrap", md: "normal" }}
//               display="flex"
//               flexDirection={{ base: "row", md: "column" }}
//               gap={4}
//               pb={{ base: 4, md: 0 }}
//             >
//               <Button
//                 onClick={handleTransfer}
//                 colorScheme="teal"
//                 size="lg"
//                 height="auto"
//                 display="block"
//                 textAlign="left"
//                 whiteSpace="normal"
//                 px={4}
//                 py={4}
//                 bg="blue.100"
//                 w="100%"
//                 borderColor="blue.600"
//                 color="black"
//                 isDisabled={selectedSeats.length === 0}
//               >
//                 <Box>
//                   {selectedSeats.length === 0 ? (
//                     <Text fontWeight="bold" color="gray.500">
//                       Chưa chọn vé nào
//                     </Text>
//                   ) : (
//                     <>
//                       {selectedSeats.map((seat, index) => (
//                         <Box
//                           key={index}
//                           p={2}
//                           mb={2}
//                           borderWidth="1px"
//                           borderRadius="md"
//                           bg="blue.200"
//                         >
//                           <Text fontWeight="bold">
//                             {seat.reservation.trainName}
//                           </Text>
//                           <Text>
//                             {seat.reservation.departureStation} -{" "}
//                             {seat.reservation.arrivalStation}
//                           </Text>
//                           <Text>{seat.departureTime}</Text>
//                           <Text>
//                             Toa {seat.stt} - Ghế {seat.seatName}
//                           </Text>
//                           <SeatCountdown expire={seat.expire} />
//                         </Box>
//                       ))}
//                       <Text fontWeight="bold">
//                         {selectedSeats.length} ghế đã chọn -{" "}
//                         {formatTotalPrice(totalPrice)}
//                       </Text>
//                     </>
//                   )}
//                 </Box>
//                 </Button>
//               {trips.map((trip) => (
//                 <Card.Root
//                   key={trip.tripId}
//                   minW={{ base: "250px", md: "auto" }}
//                   borderWidth="2px"
//                   borderColor={
//                     trip.tripId === activeTripId ? "blue.500" : "gray.200"
//                   }
//                   bg={trip.tripId === activeTripId ? "blue.50" : "white"}
//                   cursor="pointer"
//                   onClick={() => {
//                     setActiveTripId(trip.tripId);
//                     dispatch(setCurrentTrip(trip));
//                     dispatch(
//                       fetchSeat({
//                         tripId: trip.tripId,
//                         from: trip.departureStation,
//                         to: trip.arrivalStation,
//                       })
//                     )
//                       .unwrap()
//                       .then(() => {
//                         // toast.success("Tải thông tin toa tàu thành công!", {
//                         //   position: "bottom-right",
//                         //   autoClose: 3000,
//                         // });
//                       })
//                       .catch((err) => {
//                         toast.error(`Lỗi khi tải toa tàu: ${err}`, {
//                           position: "bottom-right",
//                           autoClose: 4000,
//                         });
//                       });
//                   }}
//                   transition="all 0.2s"
//                   _hover={{ shadow: "md" }}
//                 >
//                   <Card.Header>
//                     <Box bg="blue.500" color="white" px={3} py={1} borderRadius="md">
//                       <Heading size="md">
//                         Tàu: {trip.trainName || "Chưa rõ"}
//                       </Heading>
//                     </Box>
//                   </Card.Header>

//                   <Card.Body>
//                     <VStack align="start" spacing={2}>
//                       <Text>
// :《                        Thời gian đi:{" "}
//                         {new Date(trip.departureTime).toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </Text>

//                       <Text>
//                         Thời gian đến:{" "}
//                         {new Date(trip.arrivalTime).toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </Text>

//                       <Box bg="green.500" color="white" px={3} py={1} borderRadius="md">
//                         <Text>Số ghế còn lại: {trip.availableSeats}</Text>
//                       </Box>
//                     </VStack>
//                   </Card.Body>
//                 </Card.Root>
//               ))}
//             </Box>

//             {activeTrip && (
//               <Box>
//                 <Train trainConfig={carriages} />
//               </Box>
//             )}
//           </Grid>
//         )}
//       </Container>
//     </Box>
//   );
// }








//---------------------------------------------------






// import React, { useEffect, useState, useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {
//   Heading,
//   Box,
//   Text,
//   Container,
//   VStack,
//   Grid,
//   Spinner,
//   Card,
//   Button,
// } from "@chakra-ui/react";
// import { RouteContext } from "../store/RouteContext";
// import { searchTrains } from "../redux/stationSearchSlice";
// import { fetchSeat, selectSeat } from "../redux/seatSlice";
// import { setCurrentTrip } from "../redux/stationSearchSlice";
// import Train from "../components/Train";
// import cart from "../assets/cart.svg";
// import SeatCountdown from "../components/SeatCountdown/SeatCountdown";
// export default function BookingPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useContext(RouteContext);
//   const { from, to, date } = state;
//   const [activeTripId, setActiveTripId] = useState(null);

//   // Use "trips" consistently
//   const trips = useSelector((state) => state.stationSearch?.trips || []);
//   const loading = useSelector((state) => state.stationSearch?.loading);
//   const error = useSelector((state) => state.stationSearch?.error);
//   const carriages = useSelector((state) => state.seat.carriages);
//   const selectedSeats = useSelector((state) => state.seat.selectedSeats);
//   console.log("selectedSeats", selectedSeats);
//   const activeTrip = trips.find((trip) => trip.tripId === activeTripId);
//   const totalPrice = useSelector((state) => state.seat.totalPrice);
//   // console.log(date);
//   const handleTransfer = () => {
//     if (selectedSeats.length === 0) {
//       toast.error("Vui lòng chọn ghế trước khi thanh toán !", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       return;
//     }
//     navigate("/info");
//   };
//   const formatTotalPrice = (totalPrice) => {
//     return totalPrice.toLocaleString("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     });
//   };

//   useEffect(() => {
//     console.log("from: ", state.from, ", to: ", state.to, ", date", state.date);
//     console.log("from: ", state.departureStation, ", to: ", state.arrivalStation, ", date", state.date);
//     // if (from === to) {
//     //   toast.error("Ga đi và ga đến không được giống nhau!", {
//     //     position: "bottom-right",
//     //     autoClose: 4000,
//     //   });
//     //   return;
//     // }
//     if (from && to && date) {
//       console.log("from", from, "to", to);

//       dispatch(searchTrains({ from, to, date }))
//         .unwrap()
//         .then(() => {
//           toast.success("Tải danh sách chuyến tàu thành công!", {
//             position: "bottom-right",
//             autoClose: 3000,
//           });
//         })
//         .catch((err) => {
//           toast.error(`Lỗi khi tải chuyến tàu: ${err}`, {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//           setTimeout(() => {
//             navigate("/");
//           }, 2000);
//         });
//     }
//   }, [dispatch, from, to, date]);
//   // console.log("selectedSeats", selectedSeats);
//   return (
//     <Box py={12} px={4}>
//       <ToastContainer />

//       {/* Hero Section */}
//       <Box textAlign="center" mb={10}>
//         <Heading size="xl" fontWeight="bold">
//           {from} → {to}
//         </Heading>
//         <Text mt={2} color="gray.600">
//           Ngày: {date}
//         </Text>
//       </Box>

//       <Container maxW="6xl">
//         {loading && (
//           <Box textAlign="center" my={8}>
//             <Spinner size="lg" />
//             <Text mt={2}>Đang tìm kiếm chuyến tàu...</Text>
//           </Box>
//         )}

//         {!loading && error && (
//           <Text color="red.500" textAlign="center" mb={6}>
//             Lỗi: {error}
//           </Text>
//         )}

//         {!loading && trips.length === 0 && (
//           <Text textAlign="center" mt={8}>
//             Không có chuyến tàu nào phù hợp.
//           </Text>
//         )}

//         {!loading && trips.length > 0 && (
//           <Grid
//             templateColumns={{ base: "1fr", md: "1fr 3fr" }}
//             gap={6}
//             alignItems="flex-start"
//           >
//             <Box
//               overflowX={{ base: "auto", md: "visible" }}
//               whiteSpace={{ base: "nowrap", md: "normal" }}
//               display="flex"
//               flexDirection={{ base: "row", md: "column" }}
//               gap={4}
//               pb={{ base: 4, md: 0 }}
//             >
//               <Button
//                 onClick={handleTransfer}
//                 colorScheme="teal"
//                 size="lg"
//                 height="auto"
//                 display="block"
//                 textAlign="left"
//                 whiteSpace="normal"
//                 px={4}
//                 py={4}
//                 bg="blue.100"
//                 w="100%"
//                 borderColor="blue.600"
//                 color="black"
//                 isDisabled={selectedSeats.length === 0} // disable khi không có vé
//               >
//                 <Box>
//                   {selectedSeats.length === 0 ? (
//                     <Text fontWeight="bold" color="gray.500">
//                       Chưa chọn vé nào
//                     </Text>
//                   ) : (
//                     <>
//                       {selectedSeats.map((seat, index) => (
//                         <Box
//                           key={index}
//                           p={2}
//                           mb={2}
//                           borderWidth="1px"
//                           borderRadius="md"
//                           bg="blue.200"
//                         >
//                           <Text fontWeight="bold">
//                             {seat.reservation.trainName}
//                           </Text>
//                           <Text>
//                             {seat.reservation.departureStation} -{" "}
//                             {seat.reservation.arrivalStation}
//                           </Text>
//                           <Text>{seat.departureTime}</Text>
//                           <Text>
//                             Toa {seat.stt} - Ghế {seat.seatName}
//                           </Text>
//                           <SeatCountdown expire={seat.expire} />
//                         </Box>
//                       ))}
//                       <Text fontWeight="bold">
//                         {selectedSeats.length} ghế đã chọn -{" "}
//                         {formatTotalPrice(totalPrice)}
//                       </Text>

//                     </>
//                   )}
//                 </Box>
//               </Button>
//               {trips.map((trip) => (
//                 <Card.Root
//                   key={trip.tripId}
//                   minW={{ base: "250px", md: "auto" }}
//                   borderWidth="2px"
//                   borderColor={
//                     trip.tripId === activeTripId ? "blue.500" : "gray.200"
//                   }
//                   bg={trip.tripId === activeTripId ? "blue.50" : "white"}
//                   cursor="pointer"
//                   onClick={() => {
//                     setActiveTripId(trip.tripId);
//                     dispatch(setCurrentTrip(trip));
//                     console.log(
//                       trip.tripId,
//                       trip.departureStation,
//                       trip.arrivalStation
//                     );
//                     dispatch(
//                       fetchSeat({
//                         tripId: trip.tripId,
//                         from: trip.departureStation,
//                         to: trip.arrivalStation,
//                       })
//                     )
//                       .unwrap()
//                       .then(() => {
//                         // toast.success("Tải thông tin toa tàu thành công!", {
//                         //   position: "bottom-right",
//                         //   autoClose: 3000,
//                         // });
//                       })
//                       .catch((err) => {
//                         toast.error(`Lỗi khi tải toa tàu: ${err}`, {
//                           position: "bottom-right",
//                           autoClose: 4000,
//                         });
//                       });
//                   }}
//                   transition="all 0.2s"
//                   _hover={{ shadow: "md" }}
//                 >
//                   <Card.Header>
//                     <Box bg="blue.500" color="white" px={3} py={1} borderRadius="md">
//                       <Heading size="md">
//                         Tàu: {trip.trainName || "Chưa rõ"}
//                       </Heading>
//                     </Box>
//                   </Card.Header>

//                   <Card.Body>
//                     <VStack align="start" spacing={2}>
//                       <Text>
//                         Thời gian đi:{" "}
//                         {new Date(trip.departureTime).toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </Text>

//                       <Text>
//                         Thời gian đến:{" "}
//                         {new Date(trip.arrivalTime).toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </Text>

//                       <Box bg="green.500" color="white" px={3} py={1} borderRadius="md">
//                         <Text>Số ghế còn lại: {trip.availableSeats}</Text>
//                       </Box>
//                     </VStack>
//                   </Card.Body>
//                 </Card.Root>
//               ))}

//               {/* {trips.map((trip) => (
//                 <Card.Root
//                   key={trip.tripId}
//                   minW={{ base: "250px", md: "auto" }}
//                   borderWidth="2px"
//                   borderColor={
//                     trip.tripId === activeTripId ? "blue.500" : "gray.200"
//                   }
//                   bg={trip.tripId === activeTripId ? "blue.50" : "white"}
//                   cursor="pointer"
//                   onClick={() => {
//                     setActiveTripId(trip.tripId);
//                     dispatch(setCurrentTrip(trip));
//                     console.log(
//                       trip.tripId,
//                       trip.departureStation,
//                       trip.arrivalStation
//                     );
//                     dispatch(
//                       fetchSeat({
//                         tripId: trip.tripId,
//                         from: trip.departureStation,
//                         to: trip.arrivalStation,
//                       })
//                     )
//                       .unwrap()
//                       .then(() => {
//                         // toast.success("Tải thông tin toa tàu thành công!", {
//                         //   position: "bottom-right",
//                         //   autoClose: 3000,
//                         // });
//                       })
//                       .catch((err) => {
//                         toast.error(`Lỗi khi tải toa tàu: ${err}`, {
//                           position: "bottom-right",
//                           autoClose: 4000,
//                         });
//                       });
//                   }}
//                   transition="all 0.2s"
//                   _hover={{ shadow: "md" }}
//                 >
//                   <Card.Header>
//                     <Heading size="md">
//                       Tàu: {trip.trainName || "Chưa rõ"}
//                     </Heading>
//                   </Card.Header>
//                   <Card.Body>
//                     <VStack align="start" spacing={2}>
//                       <Text>Thời gian đi: {new Date(trip.departureTime).toLocaleString("vi-VN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                       })}</Text>

//                       <Text>Thời gian đến: {new Date(trip.arrivalTime).toLocaleString("vi-VN", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                       })}</Text>
//                       <Text>Số ghế còn lại: {trip.availableSeats}</Text>
//                     </VStack>
//                   </Card.Body>
//                 </Card.Root>
//               ))} */}
//             </Box>

//             {activeTrip && (
//               <Box>
//                 <Train
//                   trainConfig={carriages}

//                 />
//               </Box>
//             )}
//           </Grid>
//         )}
//       </Container>
//     </Box>
//   );
// }