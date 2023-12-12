import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo: {
        isLogged: false,
        email: "johndoe@johndoe.com",
        userID: 0,
        chosenPackID: -1, // -1, car le packID #0 existe bien
        modifPackID: -1,
        modifBookingID: -1,
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
                chosenPackID: -1,
                modifBookingID: -1,
                accountType: ""
            }
        },
        choosePack: (state, action) => {
            state.userInfo.chosenPackID = action.payload;
            //console.log("state.userInfo.chosenPackID = "+state.userInfo.chosenPackID);
        },
        modifyBooking: (state, action) => {
            state.userInfo.modifBookingID = action.payload.bookingID;
            state.userInfo.modifPackID = action.payload.packID;
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
    modifyBooking,
    setLogMessage
} = userSlice.actions;

export default userSlice.reducer;