import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Gửi request tìm kiếm ga tàu 🚆
// export const searchTrains = createAsyncThunk(
//   "stationSearch/searchTrains",
//   async ({ from, to, date }, { rejectWithValue }) => {
//     try {
//       console.log(from, to, date);
//       const response = await axios.post(`${API_BASE_URL}trips/searchs`, {
//         departureStation: from,
//         arrivalStation: to,
//         tripDate: date,
//       });
//       console.log(response.data);

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Lỗi khi tìm kiếm tàu"
//       );
//     }
//   }
// );

export const searchTrains = createAsyncThunk(
  "stationSearch/searchTrains",
  async ({ from, to, date }, { rejectWithValue }) => {
    try {
      // Validate date format
      let formattedDate = date;
      try {
        formattedDate = new Date(date).toISOString().split("T")[0];
      } catch (e) {
        return rejectWithValue({
          status: 400,
          message: "Invalid date format",
        });
      }

      console.log("Search params:", { from, to, date: formattedDate });

      const response = await axios.post(`${API_BASE_URL}trips/searchs`, {
        departureStation: from,
        arrivalStation: to,
        tripDate: formattedDate,
      });

      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Lỗi khi tìm kiếm tàu",
      });
    }
  }
);

// Lấy danh sách toa và ghế theo tripId
//   export const fetchCarriagesByTrip = createAsyncThunk(
//     "stationSearch/fetchCarriagesByTrip",
//     async (tripId, { rejectWithValue }) => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/trains/${tripId}/carriages`);
//         return { tripId, carriages: response.data };
//       } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy danh sách toa");
//       }
//     }
//   );

// Tạo slice
const stationSearchSlice = createSlice({
  name: "stationSearch",
  initialState: {
    trips: [],
    currentTrip: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentTrip: (state, action) => {
      state.currentTrip = action.payload;
    },
    resetSearch: (state) => {
      state.trips = [];
      state.currentTrip = null;
      state.loading = false;
      state.error = null;
    },


  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTrains.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload.sort((a, b) => {
          const numA = parseInt(a.trainName.match(/\d+/)[0], 10);
          const numB = parseInt(b.trainName.match(/\d+/)[0], 10);
          return numA - numB;
        })
      })
      .addCase(searchTrains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Xử lý fetchCarriagesByTrip
    // .addCase(fetchCarriagesByTrip.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    // })
    // .addCase(fetchCarriagesByTrip.fulfilled, (state, action) => {
    //     state.loading = false;
    //     const { tripId, carriages } = action.payload;
    //     state.carriages[tripId] = carriages;
    // })
    // .addCase(fetchCarriagesByTrip.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    // });
  },
});
export const { setCurrentTrip, resetSearch } = stationSearchSlice.actions;
export default stationSearchSlice.reducer;
