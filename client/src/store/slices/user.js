import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo: {
        isLogged: false,
        email: "johndoe@johndoe.com",
        userID: 0,
        chosenPackID: 0
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signin: (state, action) => {
            state.userInfo = {
                isLogged: true, 
                email: action.payload.email,
                userID: action.payload.userID
            }
        },
        signout: (state, action) => {
            state.userInfo = {
                isLogged: false,
                email: "johndoe@johndoe.com",
                userID: 0,
                chosenPackID: 0
            }
        },
        choosePack: (state, action) => {
            state.userInfo.chosenPackID = action.payload;
        }
    }
});


export const {
    signin, 
    signout,
    choosePack
} = userSlice.actions;

export default userSlice.reducer;