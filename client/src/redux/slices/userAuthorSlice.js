import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const userAuthorLoginThunk = createAsyncThunk(
  "user-author-login",
  async (userCredObj, thunkApi) => {
    try {
      let url = "";
      if (userCredObj.usertype === "user") {
        url = "http://localhost:4000/user-api/login";
      } else if (userCredObj.usertype === "author") {
        url = "http://localhost:4000/author-api/login";
      }

      const res = await axios.post(url, userCredObj);
      console.log(res.data);

      if (res.data.message === "Login successful") {
        localStorage.setItem("token", res.data.token);
        return res.data;
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const userAuthorSlice = createSlice({
  name: "user-author-login",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccured: false,
    errMsg: "",
  },
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccured = false;
      state.errMsg = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(userAuthorLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentUser = action.payload.user;
        state.loginUserStatus = true;
        state.errMsg = "";
        state.errorOccured = false;
      })
      .addCase(userAuthorLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentUser = {};
        state.loginUserStatus = false;
        state.errMsg = action.payload;
        state.errorOccured = true;
      }),
});

export const { resetState } = userAuthorSlice.actions;

export default userAuthorSlice.reducer;
