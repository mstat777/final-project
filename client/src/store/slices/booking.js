import {createSlice} from "@reduxjs/toolkit";

// pour stocker les infos lors du processus de réservation (nb de personnes, prix, etc.) :
const initialState = {
    // données actuelles de la réservation
    bookingInfo: {
        nbAdults: {
            pack: 0, // nb adultes/pack
            activities: [] // nb adultes/activité
        },
        nbChildren: {
            pack: 0, // nb d'enfants/pack
            activities: [] // nb enfants/activité
        },
        prices: {
            activityPerAdult: [], //prix adulte/activité de la BDD
            activityPerChild: [], //prix enfant/activité de la BDD
            totalAdults: [], //prix à payer pour les adultes/activité récupéré de la BDD
            totalChildren: [], //prix à payer pour les enfants/activité récupéré de la BDD
            totalPack: 0, //montant total du pack à payer
            totalActivities: 0, //montant total des activités (adultes + enfants)
            totalAll: 0 // = totalPack + totalActivities
        },
        packID: '',
        selectedActivities: []
    },
    // anciennes données de la réservation (afin de faire une MAJ) récupérées de la BDD
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
            const pricePackAdults = state.bookingInfo.nbAdults.pack * action.payload.priceAdultsPack;
            const pricePackChildren = state.bookingInfo.nbChildren.pack * action.payload.priceChildrenPack;
            state.bookingInfo.prices.totalPack = pricePackAdults + pricePackChildren;

            let sum_adults = 0;
            let sum_children = 0;
            for (let i=0; i < state.bookingInfo.nbAdults.activities.length; i++ ) {
                // calculer le prix total de chaque activité pour tous les adultes (on l'affiche sur la page Summary)
                state.bookingInfo.prices.totalAdults[i] = state.bookingInfo.nbAdults.activities[i] * action.payload.priceAdultsActivities[i];
                // calculer la somme des prix totaux de tous les activités pour tous les adultes
                sum_adults += state.bookingInfo.prices.totalAdults[i];
                // calculer le prix total de chaque activité pour tous les enfants (on l'affiche sur la page Summary)
                state.bookingInfo.prices.totalChildren[i] = state.bookingInfo.nbChildren.activities[i] * action.payload.priceChildrenActivities[i];
                // calculer la somme des prix totaux de tous les activités pour tous les enfants
                sum_children += state.bookingInfo.prices.totalChildren[i];
            }
            state.bookingInfo.prices.totalActivities = sum_adults + sum_children;
            state.bookingInfo.prices.totalAll = state.bookingInfo.prices.totalPack + state.bookingInfo.prices.totalActivities;
        },
        resetCounters: (state, action) => {
            // supprimer les anciennes valeurs des tableaux :
            state.bookingInfo.nbAdults.pack = 0;
            state.bookingInfo.nbAdults.activities = [];
            state.bookingInfo.nbChildren.pack = 0;
            state.bookingInfo.nbChildren.activities = [];
            state.bookingInfo.prices.activityPerAdult = [];
            state.bookingInfo.prices.activityPerChild = [];
            state.bookingInfo.prices.totalAdults = [];
            state.bookingInfo.prices.totalChildren = [];
            state.bookingInfo.prices.totalPack = 0;
            state.bookingInfo.prices.totalActivities = 0;
            state.bookingInfo.prices.totalAll = 0;
            state.bookingInfo.selectedActivities = [];
        },
        initialiseCounters: (state, action) => {
            state.bookingInfo.nbAdults.pack = 0;
            state.bookingInfo.nbChildren.pack = 0;
            // attribuer des valuers 0 à tous les éléments en fonction de nombre d'activités (chaque pack/destination a un nb différent) :
            for (let i=0; i < action.payload; i++){
                state.bookingInfo.nbAdults.activities.push(0);
                state.bookingInfo.nbChildren.activities.push(0);
                state.bookingInfo.prices.activityPerAdult.push(0);
                state.bookingInfo.prices.activityPerChild.push(0);
            }
        },
        incrNbAdultsPack: (state, action) => {
            state.bookingInfo.nbAdults.pack++;
        },
        decrNbAdultsPack: (state, action) => {
            state.bookingInfo.nbAdults.pack--;
            if (state.bookingInfo.nbAdults.pack < 0){ 
                state.bookingInfo.nbAdults.pack = 0;
            }
        },
        incrNbChildrenPack: (state, action) => {
            state.bookingInfo.nbChildren.pack++;
        },
        decrNbChildrenPack: (state, action) => {
            state.bookingInfo.nbChildren.pack--;
            if (state.bookingInfo.nbChildren.pack < 0){ 
                state.bookingInfo.nbChildren.pack = 0;
            }
        },
        incrNbAdultsActivity: (state, action) => {
            if (!state.bookingInfo.nbAdults.activities.length) {
                state.bookingInfo.nbAdults.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nbAdults.activities.length) {
                state.bookingInfo.nbAdults.activities[action.payload]++;
            }
        },
        decrNbAdultsActivity: (state, action) => {
            if (!state.bookingInfo.nbAdults.activities.length) {
                state.bookingInfo.nbAdults.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nbAdults.activities.length) {
                state.bookingInfo.nbAdults.activities[action.payload]--;
                if (state.bookingInfo.nbAdults.activities[action.payload] < 0) {
                    state.bookingInfo.nbAdults.activities[action.payload] = 0;
                }
            }
        },
        incrNbChildrenActivity: (state, action) => {
            if (!state.bookingInfo.nbChildren.activities.length) {
                state.bookingInfo.nbChildren.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nbChildren.activities.length) {
                state.bookingInfo.nbChildren.activities[action.payload]++;
            }
        },
        decrNbChildrenActivity: (state, action) => {
            if (!state.bookingInfo.nbChildren.activities.length) {
                state.bookingInfo.nbChildren.activities[action.payload] = 0;
            }
            if (state.bookingInfo.nbChildren.activities.length) {
                state.bookingInfo.nbChildren.activities[action.payload]--;
                if (state.bookingInfo.nbChildren.activities[action.payload] < 0){
                    state.bookingInfo.nbChildren.activities[action.payload] = 0;
                }
            }
        },
        setBookedData: (state, action) => {
            state.bookedData = action.payload;
        },
        setNbInBooking: (state, action) => {
            state.bookingInfo.nbAdults = action.payload.nbAdults;
            state.bookingInfo.nbChildren = action.payload.nbChildren;
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