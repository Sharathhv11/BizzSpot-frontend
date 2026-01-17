import { createSlice } from "@reduxjs/toolkit";

const pageState = createSlice({
    name:"pageState",
    initialState:{
        theme : true, //! true for light and false for dark
        redirectUserID:null
    },
    reducers:{
        changeTheme:function(state){
            state.theme = !state.theme;
        },
        changeRedirectUserID:function(state,action){
            state.redirectUserID = action.payload;
        }
    }
});

export const {changeTheme,changeRedirectUserID} = pageState.actions;
export default pageState.reducer;