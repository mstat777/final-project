import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo: {
        isLogged: false,
        email: "johndoe@johndoe.com"
    },
    destinationInfo: {
        name: ""
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
            }
        },
        signout: (state, action) => {
            state.userInfo = {
                isLogged: false,
                email: "johndoe@johndoe.com"
            }
        },
        choosenDestination: (state, action) => {
            state.destinationInfo = {
                name: action.payload.name
            }
        }
    }
});


export const {signin, signout, choosenDestination} = userSlice.actions;

export default userSlice.reducer;