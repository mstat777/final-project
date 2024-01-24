import {createSlice} from "@reduxjs/toolkit";

// pour stocker les infos lors du processus de réservation (nb de personnes, prix, etc.) :
const initialState = {
    // données actuelles de la réservation
    bookingInfo: {
        nb_adults: {
            pack: 0, // nb adultes/pack
            activities: [] // nb adultes/activité
        },
        nb_children: {
            pack: 0, // nb d'enfants/pack
            activities: [] // nb enfants/activité
        },
        prices: {
            activity_per_adult: [], //prix adulte/activité de la BDD
            activity_per_child: [], //prix enfant/activité de la BDD
            total_adults: [], //prix à payer pour les adultes/activité récupéré de la BDD
            total_children: [], //prix à payer pour les enfants/activité récupéré de la BDD
            total_pack: 0, //montant total du pack à payer
            total_activities: 0, //montant total des activités (adultes + enfants)
            total_all: 0 // = total_pack + total_activities
        },
        packID: '',
        selectedActivities: []
    },
    // anciennes données de la réservation (afin de faire une MAJ)
    bookedData: {},
    // nouvel état de la réservation
    newBookedAct: [],
    // ancien état de la réservation
    oldBookedAct: []
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

            let sum_adults = 0;
            let sum_children = 0;
            for (let i=0; i < state.bookingInfo.nb_adults.activities.length; i++ ) {
                // calculer le prix total de chaque activité pour tous les adultes (on l'affiche sur la page Summary)
                state.bookingInfo.prices.total_adults[i] = state.bookingInfo.nb_adults.activities[i] * action.payload.price_adults_activities[i];
                // calculer la somme des prix totaux de tous les activités pour tous les adultes
                sum_adults += state.bookingInfo.prices.total_adults[i];
                // calculer le prix total de chaque activité pour tous les enfants (on l'affiche sur la page Summary)
                state.bookingInfo.prices.total_children[i] = state.bookingInfo.nb_children.activities[i] * action.payload.price_children_activities[i];
                // calculer la somme des prix totaux de tous les activités pour tous les enfants
                sum_children += state.bookingInfo.prices.total_children[i];
            }
            state.bookingInfo.prices.total_activities = sum_adults + sum_children;
            state.bookingInfo.prices.total_all = state.bookingInfo.prices.total_pack + state.bookingInfo.prices.total_activities;
        },
        resetCounters: (state, action) => {
            // supprimer les anciennes valeurs des tableaux :
            state.bookingInfo.nb_adults.pack = 0;
            state.bookingInfo.nb_adults.activities = [];
            state.bookingInfo.nb_children.pack = 0;
            state.bookingInfo.nb_children.activities = [];
            state.bookingInfo.prices.activity_per_adult = [];
            state.bookingInfo.prices.activity_per_child = [];
            state.bookingInfo.prices.total_adults = [];
            state.bookingInfo.prices.total_children = [];
            state.bookingInfo.prices.total_pack = 0;
            state.bookingInfo.prices.total_activities = 0;
            state.bookingInfo.prices.total_all = 0;
            state.bookingInfo.selectedActivities = [];
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
        incrNbAdultsPack: (state, action) => {
            state.bookingInfo.nb_adults.pack++;
        },
        decrNbAdultsPack: (state, action) => {
            state.bookingInfo.nb_adults.pack--;
            if (state.bookingInfo.nb_adults.pack < 0){ 
                state.bookingInfo.nb_adults.pack = 0;
            }
        },
        incrNbChildrenPack: (state, action) => {
            state.bookingInfo.nb_children.pack++;
        },
        decrNbChildrenPack: (state, action) => {
            state.bookingInfo.nb_children.pack--;
            if (state.bookingInfo.nb_children.pack < 0){ 
                state.bookingInfo.nb_children.pack = 0;
            }
        },
        incrNbAdultsActivity: (state, action) => {
            if (!state.bookingInfo.nb_adults.activities.length) {
                state.bookingInfo.nb_adults.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nb_adults.activities.length) {
                state.bookingInfo.nb_adults.activities[action.payload]++;
            }
        },
        decrNbAdultsActivity: (state, action) => {
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
        incrNbChildrenActivity: (state, action) => {
            if (!state.bookingInfo.nb_children.activities.length) {
                state.bookingInfo.nb_children.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nb_children.activities.length) {
                state.bookingInfo.nb_children.activities[action.payload]++;
            }
        },
        decrNbChildrenActivity: (state, action) => {
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
        setBookedData: (state, action) => {
            state.bookedData = action.payload;
        },
        setNbInBooking: (state, action) => {
            state.bookingInfo.nb_adults = action.payload.nb_adults;
            state.bookingInfo.nb_children = action.payload.nb_children;
        },
        setPackID: (state, action) => {
            state.bookingInfo.packID = action.payload;
        },
        setSelectedActivities: (state, action) => {
            state.bookingInfo.selectedActivities = action.payload;
        },
        setNewBookedAct: (state, action) => {
            state.newBookedAct = action.payload;
        },
        setOldBookedAct: (state, action) => {
            state.oldBookedAct = action.payload;
        },
    }
});

export const { 
    calculatePrices,
    resetCounters,
    initialiseCounters, 
    incrNbAdultsPack, 
    decrNbAdultsPack, 
    incrNbChildrenPack,
    decrNbChildrenPack,
    incrNbAdultsActivity, 
    decrNbAdultsActivity,
    incrNbChildrenActivity, 
    decrNbChildrenActivity,
    setBookedData,
    setNbInBooking,
    setPackID,
    setSelectedActivities,
    setNewBookedAct,
    setOldBookedAct
    } = bookingSlice.actions;

export default bookingSlice.reducer;