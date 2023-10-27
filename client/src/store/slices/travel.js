import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    destination: JSON.parse(localStorage.getItem("destination")) || {},
    lodging: JSON.parse(localStorage.getItem("lodging")) || {},
    destinationImages: JSON.parse(localStorage.getItem("destination_images")) || {},
    lodgingImages: JSON.parse(localStorage.getItem("lodging_images")) || {},
    packs: JSON.parse(localStorage.getItem("packs")) || [],
    activities: JSON.parse(localStorage.getItem("activities")) || []
};

export const allTravelSlice = createSlice({
    name: "allTravel",
    initialState,
    reducers: {
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
    setDestination,
    setLodging,
    setDestinationImages,
    setLodgingImages,
    setPacks,
    setActivities
} = allTravelSlice.actions;

export default allTravelSlice.reducer;