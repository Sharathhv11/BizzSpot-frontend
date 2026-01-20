import { createSlice } from "@reduxjs/toolkit";

const pageState = createSlice({
  name: "pageState",
  initialState: {
    theme: true, //! true for light and false for dark
    navStack: [],
  },
  reducers: {
    changeTheme: function (state) {
      state.theme = !state.theme;
    },
    pushNav(state, action) {
      const current = action.payload;
      const last = state.navStack[state.navStack.length - 1];

      // avoid duplicate pushes
      if (current !== last) {
        state.navStack.push(current);
      }
    },

    popNav(state) {
      if (state.navStack.length >= 1) {
        state.navStack.pop();
      }
    },

    resetNav(state, action) {
      // used when user lands directly on a page
      state.navStack = [action.payload];
    },
  },
});

export const { changeTheme,pushNav,popNav,resetNav } = pageState.actions;
export default pageState.reducer;
