import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    bookingInfo: JSON.parse(localStorage.getItem("booking")) || {
        nb_adults: {
            pack: 0,
            activites: []
        },
        nb_children: {
            pack: 0,
            activites: []
        },
        prices: {
            total_pack: 0,
            total_activites: 0,
            total_all: 0
        }
    }
}

export const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        calculatePrices: (state, action) => {
            const prix_pack_adults = state.bookingInfo.nb_adults.pack * action.payload.prix_adulte;
            const prix_pack_children = state.bookingInfo.nb_children.pack * action.payload.prix_enfant;
            state.bookingInfo.prices.total_pack = prix_pack_adults + prix_pack_children;
            console.log("state.bookingInfo.nb_adults.pack = "+state.bookingInfo.nb_adults.pack);
            console.log("action.payload.prix_adulte = "+action.payload.prix_adulte);
            console.log("action.payload.prix_enfant = "+action.payload.prix_enfant);
            console.log("state.bookingInfo.prices.total_pack = "+state.bookingInfo.prices.total_pack);
        },
        setActivites: (state, action) => {
            for (let i=0; i < action.payload; i++){
                state.bookingInfo.nb_adults.activites.push(0);
                state.bookingInfo.nb_children.activites.push(0);
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
        increaseNumberAdultsActivite: (state, action) => {
            if (!state.bookingInfo.nb_adults.activites.length) {
                state.bookingInfo.nb_adults.activites[action.payload] = 0;
            }
            if (state.bookingInfo.nb_adults.activites.length) {
                state.bookingInfo.nb_adults.activites[action.payload]++;
            }
        },
        decreaseNumberAdultsActivite: (state, action) => {
            if (!state.bookingInfo.nb_adults.activites.length) {
                state.bookingInfo.nb_adults.activites[action.payload] = 0;
            }
            if (state.bookingInfo.nb_adults.activites.length) {
                state.bookingInfo.nb_adults.activites[action.payload]--;
            }
        }
    }
});

export const { 
    calculatePrices,
    setActivites, 
    increaseNumberAdultsPack, 
    decreaseNumberAdultsPack, 
    increaseNumberChildrenPack,
    decreaseNumberChildrenPack,
    increaseNumberAdultsActivite, 
    decreaseNumberAdultsActivite 
    } = bookingSlice.actions;

export default bookingSlice.reducer;