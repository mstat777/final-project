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
        },
        setResultsDestinations: (state, action) => {
            state.resultsDestinations = action.payload;
        },
        setResultsLodgings: (state, action) => {
            state.resultsLodgings = action.payload;
        },
        setResultsPacks: (state, action) => {
            state.resultsPacks = action.payload;
        },
        setResultsActivities: (state, action) => {
            state.resultsActivities = action.payload;
        },
        setResultsUsers: (state, action) => {
            state.resultsUsers = action.payload;
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