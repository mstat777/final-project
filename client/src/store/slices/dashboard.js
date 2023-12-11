import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    resultsBookings: [],
    resultsDestinations: [],
    resultsLodgings: [],
    resultsPacks: [],
    resultsActivities: [],
    resultsUsers: []
}

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setResultsBookings: (state, action) => {
            state.resultsBookings = action.payload;
            console.log("setResults called");
        },
        setResultsDestinations: (state, action) => {
            state.resultsDestinations = action.payload;
            console.log("setResults called");
        },
        setResultsLodgings: (state, action) => {
            state.resultsLodgings = action.payload;
            console.log("setResults called");
        },
        setResultsPacks: (state, action) => {
            state.resultsPacks = action.payload;
            console.log("setResults called");
        },
        setResultsActivities: (state, action) => {
            state.resultsActivities = action.payload;
            console.log("setResults called");
        },
        setResultsUsers: (state, action) => {
            state.resultsUsers = action.payload;
            console.log("setResults called");
        }
    }
});

export const {
    setResultsBookings, 
    setResultsDestinations,
    setResultsLodgings,
    setResultsPacks,
    setResultsActivities,
    setResultsUsers
} = dashboardSlice.actions;

export default dashboardSlice.reducer;