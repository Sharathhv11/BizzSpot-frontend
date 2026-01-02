import { createSlice } from "@reduxjs/toolkit";

const pageState = createSlice({
    name:"pageState",
    initialState:{
        theme : true //! true for light and false for dark
    },
    reducers:{
        changeTheme:function(state){
            state.theme = !state.theme;
        }
    }
});

export const {changeTheme} = pageState.actions;
export default pageState.reducer;