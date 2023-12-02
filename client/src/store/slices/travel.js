import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    allContinents: [],
    allDestinations: [],
    destinationsWithContinents: [],
    topDestinations: [],
    bestPromos: [],
    destination: {},
    lodging: {},
    destinationImages: [],
    lodgingImages: [],
    packs: [],
    activities: [],
    coordinates: []
};

export const allTravelSlice = createSlice({
    name: "allTravel",
    initialState,
    reducers: {
        setAllContinents: (state, action) => {
            state.allContinents = action.payload;
        },
        setAllDestinations: (state, action) => {
            state.allDestinations = action.payload;
        },
        setDestinationsWithContinents: (state, action) => {
            state.destinationsWithContinents = action.payload;
        },
        setTopDestinations: (state, action) => {
            state.topDestinations = action.payload;
        },
        setBestPromos: (state, action) => {
            state.bestPromos = action.payload;
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
        },
        setCoordinates: (state, action) => {
            state.coordinates = action.payload;
        }
    }
});

export const { 
    setAllContinents,
    setAllDestinations,
    setDestinationsWithContinents,
    setTopDestinations,
    setBestPromos,
    setDestination,
    setLodging,
    setDestinationImages,
    setLodgingImages,
    setPacks,
    setActivities,
    setCoordinates
} = allTravelSlice.actions;

export default allTravelSlice.reducer;