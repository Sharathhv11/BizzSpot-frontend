import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user.js'
import pageState from "./reducers/pageState.js"

export default configureStore({
  reducer: {
    user: userReducer,
    pageState
  }
})