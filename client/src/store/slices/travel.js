import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    destination: JSON.parse(localStorage.getItem("destination")) || {},
    hebergement: JSON.parse(localStorage.getItem("hebergement")) || {},
    destinationImages: JSON.parse(localStorage.getItem("destination_images")) || {},
    hebergementImages: JSON.parse(localStorage.getItem("hebergement_images")) || {},
    packs: JSON.parse(localStorage.getItem("packs")) || [],
    activites: JSON.parse(localStorage.getItem("activites")) || {}
};

export const allTravelSlice = createSlice({
    name: "allTravel",
    initialState,
    reducers: {
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setHebergement: (state, action) => {
            state.hebergement = action.payload;
        },
        setDestinationImages: (state, action) => {
            state.destinationImages = action.payload;
        },
        setHebergementImages: (state, action) => {
            state.hebergementImages = action.payload;
        },
        setPacks: (state, action) => {
            state.packs = action.payload;
        },
        setActivites: (state, action) => {
            state.activites = action.payload;
        }
    }
});

export const { 
    setDestination,
    setHebergement,
    setDestinationImages,
    setHebergementImages,
    setPacks,
    setActivites
} = allTravelSlice.actions;

export default allTravelSlice.reducer;