import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Make http request using redux-thunk middleware
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

      // Check if login is successful
      if (res.data.message === "Login successful") {
        // Store the token in localStorage
        localStorage.setItem("token", res.data.token);
        // Return the response data
        return res.data;
      } else {
        // If login failed, reject with error message
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      // Handle any other errors
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
        state.currentUser = action.payload.user; // Ensure 'user' is present in payload
        state.loginUserStatus = true;
        state.errMsg = "";
        state.errorOccured = false;
      })
      .addCase(userAuthorLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentUser = {};
        state.loginUserStatus = false;
        state.errMsg = action.payload; // Error message from thunkApi.rejectWithValue
        state.errorOccured = true;
      }),
});

// Export action creator function
export const { resetState } = userAuthorSlice.actions;
// Export root reducer of this slice
export default userAuthorSlice.reducer;
