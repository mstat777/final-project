import { store } from "../../store";
import { setBestPromos, 
        setTopDestinations,
        setAllContinents,
        setAllDestinations,
        setDestinationsWithContinents,
        setDestination,
        setLodging,
        setPacks,
        setActivities,
        setDestinationImages, 
        setLodgingImages
        } from "../../store/slices/travel";
import { resetCounters, 
        initialiseCounters 
        } from "../../store/slices/booking";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// trouver tous les continents :
async function fetchAllContinents() {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/continent/all`)).json();
        const resultArray = result.datas.map(el => el.continent);
        store.dispatch(setAllContinents(resultArray));
    } catch (error) {
        console.log(error);
    }
}

// trouver toutes les destinations :
async function fetchAllDestinations() {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination/all`)).json();
        const resultArray = result.datas.map(el => el.name);
        store.dispatch(setAllDestinations(resultArray));
    } catch (error) {
        console.log(error);
    }
}

//
async function fetchAllContinentsAndDestinations() {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination/all-with-continent`)).json();
        store.dispatch(setDestinationsWithContinents(result.datas));
    } catch (error) {
        console.log(error);
    }
}

// récupérer toutes les données liées à une destination :
async function fetchDestinationAllPacks(destination){
    try {
        const dataAll = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination-all-packs/${destination}`)).json();
        store.dispatch(setDestination(dataAll.datasDest[0]));
        store.dispatch(setPacks(dataAll.datasPacks));
        store.dispatch(setLodging(dataAll.datasLodg[0]));
        store.dispatch(setDestinationImages(dataAll.datasDestImg));
        store.dispatch(setLodgingImages(dataAll.datasLodgImg));
    } catch (error) {
        console.log(error);
    }
}

// récupérer toutes les données liées à une destination :
async function fetchDestinationAllData(destination){
    try {
        const dataAll = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination-all-data/${destination}`)).json();
        store.dispatch(setDestination(dataAll.datasDest[0]));
        store.dispatch(setPacks(dataAll.datasPacks));
        store.dispatch(setLodging(dataAll.datasLodg[0]));
        store.dispatch(setDestinationImages(dataAll.datasDestImg));
        store.dispatch(setLodgingImages(dataAll.datasLodgImg));
        store.dispatch(setActivities(dataAll.datasAct));
    } catch (error) {
        console.log(error);
    }
}

// récupérer les données des activités liées à la destination :
async function fetchActivities(destination_id) {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/activities/${destination_id}`)).json();
        store.dispatch(setActivities(result.datas));
        store.dispatch(resetCounters());
        store.dispatch(initialiseCounters(result.datas.length));
    } catch (error) {
        console.log(error);
    }
}

async function fetchBestPromoPack(){
    try {
        const result = await(await fetch(`${BASE_URL}/api/v.0.1/travel/pack/best-promo`)).json();
        store.dispatch(setBestPromos(result.datas));
    } catch (error) {
        console.log(error);
    }
}

async function fetchTopDestination(){
    try {
        const result = await(await fetch(`${BASE_URL}/api/v.0.1/travel/destination/top-offer`)).json();
        store.dispatch(setTopDestinations(result.datas));
    } catch (error) {
        console.log(error);
    }
}

export { fetchAllContinents,
        fetchAllDestinations,
        fetchAllContinentsAndDestinations,
        fetchDestinationAllPacks,
        fetchDestinationAllData,
        fetchActivities,
        fetchBestPromoPack,
        fetchTopDestination
        };