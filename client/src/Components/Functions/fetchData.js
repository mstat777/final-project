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

// fonction pour supprimer des clés du localstorage
// on passe une liste de clés à supprimer dans un tableau
function deleteLocStorageItems(arrayOfItems) {
    arrayOfItems.forEach(itemName => {
        // vérifier si la clé existe
        localStorage.getItem(`${itemName}`) !== null && localStorage.removeItem(`${itemName}`)
    });
}

// trouver tous les continents :
async function fetchAllContinents() {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/continent/all`)).json();
        //console.log(result.datas);
        const resultArray = result.datas.map(el => el.continent);
        //console.log(resultArray);
        store.dispatch(setAllContinents(resultArray));
    } catch (error) {
        console.log(error);
    }
}

// trouver toutes les destinations :
async function fetchAllDestinations() {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination/all`)).json();
        //console.log(result.datas);
        const resultArray = result.datas.map(el => el.name);
        //console.log(resultArray);
        store.dispatch(setAllDestinations(resultArray));
    } catch (error) {
        console.log(error);
    }
}

//
async function fetchAllContinentsAndDestinations() {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination/all-with-continent`)).json();
        //console.log(result.datas);
        store.dispatch(setDestinationsWithContinents(result.datas));
    } catch (error) {
        console.log(error);
    }
}

// trouver une destination par son nom :
async function fetchDestination(destination){
    // on récupère les données de la destination :
    const dataDest = await (await fetch(`${BASE_URL}/api/v.0.1/travel/destination/${destination}`)).json();

    if(dataDest.datas[0]){
        console.log("la destination a été trouvée dans la BD");
        localStorage.setItem("destination", JSON.stringify(dataDest.datas[0]));
        store.dispatch(setDestination(dataDest.datas[0]));

        deleteLocStorageItems(['lodging', 'packs', 'activities']);
        
        const destID = dataDest.datas[0].id;
        await fetchDestinationImages(destID);
        const lodgID = dataDest.datas[0].lodging_id;
        await fetchLodgingImages(lodgID);
    } else {
        console.log("la destination n'a pas été trouvée!!!");
    }
    //setMsg(dataDest.msg);
}

// récupérer les données de l'hébérgement lié à la destination :
async function fetchLodging(lodging_id) {
    try {
        const dataLodg = await (await fetch(`${BASE_URL}/api/v.0.1/travel/lodging/${lodging_id}`)).json();
        localStorage.setItem("lodging", JSON.stringify(dataLodg.datas[0]));
        store.dispatch(setLodging(dataLodg.datas[0]));
    } catch (error) {
        console.log(error);
    }
}

// récupérer les données des packs liées à la destination :
async function fetchPacks(destination_id) {
    try {
        const dataPack = await (await fetch(`${BASE_URL}/api/v.0.1/travel/pack/${destination_id}`)).json();
        console.log("des packs ont été trouvés dans la BD");
        localStorage.setItem("packs", JSON.stringify(dataPack.datas));
        store.dispatch(setPacks(dataPack.datas));  
    } catch (error) {
        console.log(error);
    }
}

// récupérer les données des activités liées à la destination :
async function fetchActivities(destination_id) {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/travel/activities/${destination_id}`)).json();
        localStorage.setItem("activities", JSON.stringify(result.datas));
        store.dispatch(setActivities(result.datas));
        store.dispatch(resetCounters());
        store.dispatch(initialiseCounters(result.datas.length));
    } catch (error) {
        console.log(error);
    }
}

async function fetchDestinationImages(destinationID){
    try {
        //console.log("destinationID = "+destinationID);
        const result = await(await fetch(`${BASE_URL}/api/v.0.1/travel/destination/img/all/${destinationID}`)).json();
        store.dispatch(setDestinationImages(result.datas));
    } catch (error) {
        console.log(error);
    }
}

async function fetchLodgingImages(lodgingID){
    try {
        const result = await(await fetch(`${BASE_URL}/api/v.0.1/travel/lodging/img/all/${lodgingID}`)).json();
        store.dispatch(setLodgingImages(result.datas));
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

export { 
        fetchAllContinents,
        fetchAllDestinations,
        fetchAllContinentsAndDestinations,
        fetchDestination,
        fetchLodging,
        fetchPacks,
        fetchActivities,
        fetchDestinationImages, 
        fetchLodgingImages,
        fetchBestPromoPack,
        fetchTopDestination
    };