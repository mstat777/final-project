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

            let sum_adults = 0;
            let sum_children = 0;
            for (let i=0; i < state.bookingInfo.nb_adults.activities.length; i++ ) {
                console.log("action.payload.price_adults_activities[i]= "+action.payload.price_adults_activities[i]);
                console.log("state.bookingInfo.nb_adults.activities[i] = "+state.bookingInfo.nb_adults.activities[i]);

                sum_adults += state.bookingInfo.nb_adults.activities[i] * action.payload.price_adults_activities[i];
                sum_children += state.bookingInfo.nb_children.activities[i] * action.payload.price_children_activities[i];
            }
            state.bookingInfo.prices.total_activities = sum_adults + sum_children;
            console.log("state.bookingInfo.prices.total_activities = "+state.bookingInfo.prices.total_activities);

            state.bookingInfo.prices.total_all = state.bookingInfo.prices.total_pack + state.bookingInfo.prices.total_activities;
        },
        resetCounters: (state, action) => {
            // supprimer les anciennes valeurs des tableaux :
            state.bookingInfo.nb_adults.activities = [];
            state.bookingInfo.nb_children.activities = [];
            state.bookingInfo.prices.activities_adults = [];
            state.bookingInfo.prices.activities_children = [];
        },
        initialiseCounters: (state, action) => {
            state.bookingInfo.nb_adults.pack = 0;
            state.bookingInfo.nb_children.pack = 0;
            // attribuer des valuers 0 à tous les éléments en fonction de nombre d'activités (chaque pack/destination a un nb différent) :
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
        },
        increaseNumberChildrenActivity: (state, action) => {
            if (!state.bookingInfo.nb_children.activities.length) {
                state.bookingInfo.nb_children.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nb_children.activities.length) {
                state.bookingInfo.nb_children.activities[action.payload]++;
            }
        },
        decreaseNumberChildrenActivity: (state, action) => {
            if (!state.bookingInfo.nb_children.activities.length) {
                state.bookingInfo.nb_children.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nb_children.activities.length) {
                state.bookingInfo.nb_children.activities[action.payload]--;
            }
        },
    }
});

export const { 
    calculatePrices,
    resetCounters,
    initialiseCounters, 
    increaseNumberAdultsPack, 
    decreaseNumberAdultsPack, 
    increaseNumberChildrenPack,
    decreaseNumberChildrenPack,
    increaseNumberAdultsActivity, 
    decreaseNumberAdultsActivity,
    increaseNumberChildrenActivity, 
    decreaseNumberChildrenActivity
    } = bookingSlice.actions;

export default bookingSlice.reducer;