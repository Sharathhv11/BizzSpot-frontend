import { createSlice } from "@reduxjs/toolkit";

const pageState = createSlice({
  name: "pageState",
  initialState: {
    theme: true, // true = light, false = dark
    navStack: [],
    hamburgerMenu: false,
    followingFeed: {
      tweets: [],
      page: 1,
      hasMore: true,
      fetchedPages: [], 
    },
    forYouFeed: {
      tweets: [],
      page: 1,
      hasMore: true,
      fetchedPages: [], 
    },
    distance: 10_000,
  },
  reducers: {
    changeTheme(state) {
      state.theme = !state.theme;
    },

    pushNav(state, action) {
      const current = action.payload;
      const last = state.navStack[state.navStack.length - 1];
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
      state.navStack = [action.payload];
    },

    toggleHamburgerMenu(state) {
      state.hamburgerMenu = !state.hamburgerMenu;
    },

    /* ========= FOLLOWING FEED ========= */
    setFollowingFeed(state, action) {
      state.followingFeed.tweets.push(...action.payload.tweets);
    },

    addFollowingFetchedPage(state, action) {
      // Only add if not already cached
      if (!state.followingFeed.fetchedPages.includes(action.payload)) {
        state.followingFeed.fetchedPages.push(action.payload);
      }
    },

    updateFollowingFeedPage(state, action) {
      state.followingFeed.page = action.payload;
    },

    updateFollowingHasMore(state, action) {
      state.followingFeed.hasMore = action.payload;
    },

    clearFollowingFeed(state) {
      state.followingFeed.tweets = [];
      state.followingFeed.page = 1;
      state.followingFeed.hasMore = true;
      state.followingFeed.fetchedPages = [];  
    },

    /* ========= FOR YOU FEED ========= */
    setForYouFeed(state, action) {
      state.forYouFeed.tweets.push(...action.payload.tweets);
    },

    addForYouFetchedPage(state, action) {
      // Only add if not already cached
      if (!state.forYouFeed.fetchedPages.includes(action.payload)) {
        state.forYouFeed.fetchedPages.push(action.payload);
      }
    },

    updateForYouFeedPage(state, action) {
      state.forYouFeed.page = action.payload;
    },

    updateForYouHasMore(state, action) {
      state.forYouFeed.hasMore = action.payload;
    },

    clearForYouFeed(state) {
      state.forYouFeed.tweets = [];
      state.forYouFeed.page = 1;
      state.forYouFeed.hasMore = true;
      state.forYouFeed.fetchedPages = [];  
    },

    changeDistance(state, action) {
      state.distance = action.payload;
    },
  },
});

export const {
  changeTheme,
  pushNav,
  popNav,
  resetNav,
  toggleHamburgerMenu,
  setFollowingFeed,
  addFollowingFetchedPage,      
  updateFollowingFeedPage,
  updateFollowingHasMore,
  clearFollowingFeed,
  setForYouFeed,
  addForYouFetchedPage,         
  updateForYouFeedPage,
  updateForYouHasMore,
  clearForYouFeed,
  changeDistance,
} = pageState.actions;

export default pageState.reducer;
