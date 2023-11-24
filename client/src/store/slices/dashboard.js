import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    results: []
}

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setResults: (state, action) => {
            state.results = action.payload;
            console.log("setResults called");
        }
    }
});

export const {
    setResults
} = dashboardSlice.actions;

export default dashboardSlice.reducer;