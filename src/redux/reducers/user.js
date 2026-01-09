import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    usersBusiness: [],
    hasFetchedBusinesses: false
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    setUserBusiness: (state, action) => {
      state.usersBusiness = action.payload; 
      state.hasFetchedBusinesses = true;
    },
    clearUserBusiness: (state) => {
      state.usersBusiness = [];
    }
  }
});

export const {
  setUserInfo,
  clearUserInfo,
  setUserBusiness,
  clearUserBusiness
} = userSlice.actions;

export default userSlice.reducer;
