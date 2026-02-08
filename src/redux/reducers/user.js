import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  usersBusiness: [],
  hasFetchedBusinesses: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setUserBusiness: (state, action) => {
      state.usersBusiness = action.payload;
      state.hasFetchedBusinesses = true;
    },
    removeUserBusiness: (state, action) => {
      const idToRemove = action.payload;

      state.usersBusiness = state.usersBusiness.filter(
        (business) => business._id !== idToRemove,
      );
    },

    resetStates: () => initialState,
  },
});

export const { setUserInfo, setUserBusiness, resetStates,removeUserBusiness } = userSlice.actions;

export default userSlice.reducer;
