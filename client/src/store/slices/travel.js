import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    allDestinations: [],
    destination: {},
    lodging: {},
    destinationImages: [],
    lodgingImages: [],
    packs: [],
    activities: []
};

export const allTravelSlice = createSlice({
    name: "allTravel",
    initialState,
    reducers: {
        setAllDestinations: (state, action) => {
            state.allDestinations = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setLodging: (state, action) => {
            state.lodging = action.payload;
        },
        setDestinationImages: (state, action) => {
            state.destinationImages = action.payload;
        },
        setLodgingImages: (state, action) => {
            state.lodgingImages = action.payload;
        },
        setPacks: (state, action) => {
            state.packs = action.payload;
        },
        setActivities: (state, action) => {
            state.activities = action.payload;
        }
    }
});

export const { 
    setAllDestinations,
    setDestination,
    setLodging,
    setDestinationImages,
    setLodgingImages,
    setPacks,
    setActivities
} = allTravelSlice.actions;

export default allTravelSlice.reducer;