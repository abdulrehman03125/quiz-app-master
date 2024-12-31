import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isLogin: false,
  error: false,
  errorMessage: null,
  isRegister: false,
};

// login
export const loginAsyncCall = createAsyncThunk(
  "authSlice/loginAsyncCall",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3007/user/login", data);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Register
export const registerAsyncCall = createAsyncThunk(
  "authSlice/registerAsyncCall",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3007/user/register", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "authSlice",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoading = false;
      state.error = false;
      state.isLogin = false;
      state.errorMessage = null;
    },
    resetisRegister: (state) => {
      state.isRegister = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsyncCall.pending, (state, action) => {
      state.isLoading = true;
      state.error = false;
      state.errorMessage = null;
      state.isLogin = false;
    });
    builder.addCase(loginAsyncCall.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.isLogin = true;
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
    });
    builder.addCase(loginAsyncCall.rejected, (state, action) => {
      console.log(action.payload);

      state.isLoading = false;
      state.error = true;
      state.isLogin = false;
      state.errorMessage = action.payload.message;
    });

    // Register Casess
    builder.addCase(registerAsyncCall.pending, (state, action) => {
      state.isLoading = true;
      state.error = false;
      state.errorMessage = null;
      state.isRegister = false;
    });
    builder.addCase(registerAsyncCall.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      (state.isRegister = true), (state.errorMessage = action.payload.message);
    });
    builder.addCase(registerAsyncCall.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
      state.isRegister = false;
      state.errorMessage = action.payload.message;
    });
  },
});

// Action creators are generated for each case reducer function
export const { logout, resetisRegister } = authSlice.actions;

export default authSlice.reducer;
