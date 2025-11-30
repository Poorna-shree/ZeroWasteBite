import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "../App";

// Fetch chat by shopOrderId
export const fetchChat = createAsyncThunk(
  "chat/fetchChat",
  async (shopOrderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${serverUrl}/api/chat/${shopOrderId}`, {
        withCredentials: true,
      });
      return { ...res.data.chat, shopOrderId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Send chat message (backend emits)
export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async ({ shopOrderId, text, tempId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/chat/send`,
        { shopOrderId, text, tempId },
        { withCredentials: true }
      );
      return res.data.payload;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    currentRoom: null,
    messages: [],
    participants: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
      state.messages = [];
      state.participants = [];
      state.error = null;
    },
    receiveSocketMessage: (state, action) => {
      const msg = action.payload;
      if (msg.shopOrderId !== state.currentRoom) return; // only for current room

      // Replace optimistic message
      if (msg.tempId) {
        const idx = state.messages.findIndex((m) => m._id === msg.tempId);
        if (idx !== -1) {
          state.messages[idx] = msg;
          return;
        }
      }

      state.messages.push(msg);
    },
    setParticipants: (state, action) => {
      state.participants = action.payload || [];
    },
    clearChatState: (state) => {
      state.currentRoom = null;
      state.messages = [];
      state.participants = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages || [];
        state.participants = action.payload.participants || [];
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentRoom, receiveSocketMessage, setParticipants, clearChatState } =
  chatSlice.actions;

export default chatSlice.reducer;
