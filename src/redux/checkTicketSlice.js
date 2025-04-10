import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchTicketById = createAsyncThunk("checkTicket/searchTicketById",
    async (ticketId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}tickets/searchTicket`, { ticketId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const searchTicketsByCustomer = createAsyncThunk("checkTicket/searchTicketsByCustomer",
    async ({ cccd, phone }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}tickets/searchCusTicket`, { cccd, phone });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const checkTicketSlice = createSlice({
    name: "checkTicket",
    initialState: {
        tickets: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = [action.payload];
            })
            .addCase(searchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(searchTicketsByCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchTicketsByCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(searchTicketsByCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default checkTicketSlice.reducer;
