import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo: {
        isLogged: false,
        email: "johndoe@johndoe.com",
        userID: 0,
        chosenPackID: -1, // car packID #0 existe bien
        accountType: ""
    },
    logMessage: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signin: (state, action) => {
            state.userInfo = {
                isLogged: true, 
                email: action.payload.email,
                userID: action.payload.userID,
                accountType: action.payload.accountType
            }
        },
        signout: (state, action) => {
            state.userInfo = {
                isLogged: false,
                email: "johndoe@johndoe.com",
                userID: 0,
                accountType: "",
                chosenPackID: -1
            }
        },
        choosePack: (state, action) => {
            state.userInfo.chosenPackID = action.payload;
            //console.log("state.userInfo.chosenPackID = "+state.userInfo.chosenPackID);
        },
        setLogMessage: (state, action) => {
            state.logMessage = action.payload;
        }
    }
});

export const {
    signin, 
    signout,
    choosePack,
    setLogMessage
} = userSlice.actions;

export default userSlice.reducer;