import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    destinationInfo: JSON.parse(localStorage.getItem("destination")) || {}
};

export const destinationSlice = createSlice({
    name: "destination",
    initialState,
    reducers: {
        setDestination: (state, action) => {
            state.destinationInfo = action.payload.destinationInfo;
        },
    },
});

export const { setDestination } = destinationSlice.actions;

export default destinationSlice.reducer;