import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    // pour stocker les infos lors du processus de réservation (nb de personnes, prix, etc.) :
    bookingInfo: JSON.parse(localStorage.getItem("booking")) || {
        nb_adults: {
            pack: 0, // nb d'adultes par pack
            activities: [] // nb d'adultes par activité
        },
        nb_children: {
            pack: 0, // nb d'enfants par pack
            activities: [] // nb d'enfants par activité
        },
        prices: {
            activity_per_adult: [], //prix défini par adulte/activité récupéré de la BDD
            activity_per_child: [], //prix défini par enfant/activité récupéré de la BDD
            total_adults: [], //prix à payer pour les adultes/activité récupéré de la BDD
            total_children: [], //prix à payer pour les enfants/activité récupéré de la BDD
            total_pack: 0, //la somme à payer que pour le pack
            total_activities: 0, //la somme des prix pour toutes les activités (adultes + enfants)
            total_all: 0 // = total_pack + total_activities
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

            //console.log("action.payload.price_adults_activities = "+action.payload.price_adults_activities);

            let sum_adults = 0;
            let sum_children = 0;
            for (let i=0; i < state.bookingInfo.nb_adults.activities.length; i++ ) {
                //console.log("action.payload.price_adults_activities[i]= "+action.payload.price_adults_activities[i]);
                //console.log("state.bookingInfo.nb_adults.activities[i] = "+state.bookingInfo.nb_adults.activities[i]);
                // calculer le prix total de chaque activité pour tous les adultes (on l'affiche sur la page Summary)
                state.bookingInfo.prices.total_adults[i] = state.bookingInfo.nb_adults.activities[i] * action.payload.price_adults_activities[i];
                // calculer la somme des prix totaux de tous les activités pour tous les adultes
                sum_adults += state.bookingInfo.prices.total_adults[i];
                // calculer le prix total de chaque activité pour tous les enfants (on l'affiche sur la page Summary)
                state.bookingInfo.prices.total_children[i] = state.bookingInfo.nb_children.activities[i] * action.payload.price_children_activities[i];
                // calculer la somme des prix totaux de tous les activités pour tous les enfants
                sum_children += state.bookingInfo.prices.total_children[i];
            }
            //console.log("sum_adults = "+sum_adults);
            //console.log("sum_children = "+sum_children);

            state.bookingInfo.prices.total_activities = sum_adults + sum_children;
            //console.log("state.bookingInfo.prices.total_activities = "+state.bookingInfo.prices.total_activities);

            state.bookingInfo.prices.total_all = state.bookingInfo.prices.total_pack + state.bookingInfo.prices.total_activities;
        },
        resetCounters: (state, action) => {
            // supprimer les anciennes valeurs des tableaux :
            state.bookingInfo.nb_adults.activities = [];
            state.bookingInfo.nb_children.activities = [];
            state.bookingInfo.prices.activity_per_adult = [];
            state.bookingInfo.prices.activity_per_child = [];
        },
        initialiseCounters: (state, action) => {
            state.bookingInfo.nb_adults.pack = 0;
            state.bookingInfo.nb_children.pack = 0;
            // attribuer des valuers 0 à tous les éléments en fonction de nombre d'activités (chaque pack/destination a un nb différent) :
            for (let i=0; i < action.payload; i++){
                state.bookingInfo.nb_adults.activities.push(0);
                state.bookingInfo.nb_children.activities.push(0);
                state.bookingInfo.prices.activity_per_adult.push(0);
                state.bookingInfo.prices.activity_per_child.push(0);
            }
        },
        increaseNumberAdultsPack: (state, action) => {
            state.bookingInfo.nb_adults.pack++;
        },
        decreaseNumberAdultsPack: (state, action) => {
            state.bookingInfo.nb_adults.pack--;
            if (state.bookingInfo.nb_adults.pack < 0){ 
                state.bookingInfo.nb_adults.pack = 0;
            }
        },
        increaseNumberChildrenPack: (state, action) => {
            state.bookingInfo.nb_children.pack++;
        },
        decreaseNumberChildrenPack: (state, action) => {
            state.bookingInfo.nb_children.pack--;
            if (state.bookingInfo.nb_children.pack < 0){ 
                state.bookingInfo.nb_children.pack = 0;
            }
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
                if (state.bookingInfo.nb_adults.activities[action.payload] < 0) {
                    state.bookingInfo.nb_adults.activities[action.payload] = 0;
                }
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
                if (state.bookingInfo.nb_children.activities[action.payload] < 0){
                    state.bookingInfo.nb_children.activities[action.payload] = 0;
                }
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