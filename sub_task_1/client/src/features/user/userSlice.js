import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  loginWithLocal, phoneLogin, phoneVerify } from "./userAPI";

const initialState = {
  fullName: "",
  email: "",
  avatar:"",
  phoneNumber: "",
  ID: "",
  roles: [],
  isEmailVerified: false,
  isPhoneVerified: false,
  isLogged: false,
  token: "",
  error: null,
  status: "idle",
};

export const loginWithLocalAsync = createAsyncThunk(
  "user/loginWithLocal",
  async (username, password) => {
    // will throw error on error
    const response = await loginWithLocal(username, password);
    return response.data;
  }
);

export const phoneLoginAsync = createAsyncThunk(
  "user/phoneLoginAsync",
  async (phoneNumber) => {
    const response = await phoneLogin(phoneNumber);
    return response.data;
  }
);

export const phoneVerifyAsync = createAsyncThunk(
  "user/phoneVerifyAsync",
  async ({phoneNumber,otp}) => {
    const response = await phoneVerify(phoneNumber,otp);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload;
    },
    logout: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithLocalAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithLocalAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      })
      .addCase(loginWithLocalAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(phoneLoginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(phoneLoginAsync.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(phoneLoginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(phoneVerifyAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(phoneVerifyAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log("payload::",action.payload)
        state.token = action.payload.token;
        state.ID = action.payload.me.id;
        state.roles = action.payload.me.roles;
        state.isLogged = true
        state.isPhoneVerified = action.payload.me.isPhoneVerified
        state.isEmailVerified = action.payload.me.isEmailVerified
        state.email = action.payload.me.email
        state.avatar = action.payload.me.avatar
        state.fullName = action.payload.me.fullName
        state.phoneNumber = action.payload.me.phoneNumber
      })
      .addCase(phoneVerifyAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setUser, logout } = userSlice.actions;

export const selectUser = (state) => state.user;


export default userSlice.reducer;
