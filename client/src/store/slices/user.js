import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo : {
        isLogged: false,
        email: "johndoe@johndoe.com"
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signin: (state, action) => {
            state.userInfo = {
                isLogged: true, 
                email: action.payload.email
            };
        },
        signout: (state, action) => {
            state.userInfo = {
                isLogged: false,
                email: "johndoe@johndoe.com"
            };
        }
    }
});


export const {signin, signout} = userSlice.actions;

export default userSlice.reducer;