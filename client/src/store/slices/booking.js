import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    bookingInfo: JSON.parse(localStorage.getItem("booking")) || {
        nb_adults: {
            pack: 0,
            activities: []
        },
        nb_children: {
            pack: 0,
            activities: []
        },
        prices: {
            activities_adults: [],
            activities_children: [],
            total_pack: 0,
            total_activities: 0,
            total_all: 0
        }
    }
}

export const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        calculatePrices: (state, action) => {
            // calculer pour les packs :
            const price_pack_adults = state.bookingInfo.nb_adults.pack * action.payload.price_adults_pack;
            const price_pack_children = state.bookingInfo.nb_children.pack * action.payload.price_children_pack;

            state.bookingInfo.prices.total_pack = price_pack_adults + price_pack_children;

            console.log("action.payload.price_adults_activities = "+action.payload.price_adults_activities);

            let temp = 0;
            for (let i=0; i < state.bookingInfo.nb_adults.activities.length; i++ ) {
                console.log("action.payload.price_adults_activities[index]= "+action.payload.price_adults_activities[i]);
                console.log("state.bookingInfo.nb_adults.activities[i] = "+state.bookingInfo.nb_adults.activities[i]);

                temp += state.bookingInfo.nb_adults.activities[i] * action.payload.price_adults_activities[i];

                console.log("state.bookingInfo.prices.total_activities = "+state.bookingInfo.prices.total_activities);
            }
            state.bookingInfo.prices.total_activities = temp;
         

            state.bookingInfo.prices.total_all = state.bookingInfo.prices.total_pack + state.bookingInfo.prices.total_activities;
        },
        setActivities: (state, action) => {
            for (let i=0; i < action.payload; i++){
                state.bookingInfo.nb_adults.activities.push(0);
                state.bookingInfo.nb_children.activities.push(0);
                state.bookingInfo.prices.activities_adults.push(0);
                state.bookingInfo.prices.activities_children.push(0);
            }
        },
        increaseNumberAdultsPack: (state, action) => {
            state.bookingInfo.nb_adults.pack++;
        },
        decreaseNumberAdultsPack: (state, action) => {
            state.bookingInfo.nb_adults.pack--;
        },
        increaseNumberChildrenPack: (state, action) => {
            state.bookingInfo.nb_children.pack++;
        },
        decreaseNumberChildrenPack: (state, action) => {
            state.bookingInfo.nb_children.pack--;
        },
        increaseNumberAdultsActivity: (state, action) => {
            if (!state.bookingInfo.nb_adults.activities.length) {
                state.bookingInfo.nb_adults.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nb_adults.activities.length) {
                state.bookingInfo.nb_adults.activities[action.payload]++;
            }
        },
        decreaseNumberAdultsActivity: (state, action) => {
            if (!state.bookingInfo.nb_adults.activities.length) {
                state.bookingInfo.nb_adults.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nb_adults.activities.length) {
                state.bookingInfo.nb_adults.activities[action.payload]--;
            }
        }
    }
});

export const { 
    calculatePrices,
    setActivities, 
    increaseNumberAdultsPack, 
    decreaseNumberAdultsPack, 
    increaseNumberChildrenPack,
    decreaseNumberChildrenPack,
    increaseNumberAdultsActivity, 
    decreaseNumberAdultsActivity 
    } = bookingSlice.actions;

export default bookingSlice.reducer;