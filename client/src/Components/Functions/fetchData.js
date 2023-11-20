import { store } from "../../store";
import { setBestPromo, 
        setTopDestination,
        setDestination,
        setPacks,
        setDestinationImages, 
        setLodgingImages
        } from "../../store/slices/travel";

// fonction pour supprimer des clés du localstorage
// on passe une liste de clés à supprimer dans un tableau
function deleteLocStorageItems(arrayOfItems) {
    arrayOfItems.forEach(itemName => {
        // vérifier si la clé existe
        localStorage.getItem(`${itemName}`) !== null && localStorage.removeItem(`${itemName}`)
    });
}

// on passe le nom de la destination
async function fetchDestination(destination){
    // on récupère les données de la destination :
    const dataDest = await (await fetch(`/api/v.0.1/travel/destination/${destination}`)).json();

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

// récupérer les données des packs liées à la destination :
async function fetchPacks(destination_id) {
    try {
        const dataPack = await (await fetch(`/api/v.0.1/travel/pack/${destination_id}`)).json();
        console.log("des packs ont été trouvés dans la BD");
        localStorage.setItem("packs", JSON.stringify(dataPack.datas));
        store.dispatch(setPacks(dataPack.datas));  
    } catch (error) {
        console.log(error);
    }
}

async function fetchDestinationImages(destinationID){
    try {
        //console.log("destinationID = "+destinationID);
        const result = await(await fetch(`/api/v.0.1/travel/destination/img/all/${destinationID}`)).json();
        store.dispatch(setDestinationImages(result.datas));
    } catch (error) {
        console.log(error);
    }
}

async function fetchLodgingImages(lodgingID){
    try {
        const result = await(await fetch(`/api/v.0.1/travel/lodging/img/all/${lodgingID}`)).json();
        store.dispatch(setLodgingImages(result.datas));
    } catch (error) {
        console.log(error);
    }
}

async function fetchBestPromoPack(){
    try {
        const result = await(await fetch(`/api/v.0.1/travel/pack/best-promo`)).json();
        store.dispatch(setBestPromo(result.datas[0]));
    } catch (error) {
        console.log(error);
    }
}

async function fetchTopDestination(){
    try {
        const result = await(await fetch(`/api/v.0.1/travel/destination/top-offer`)).json();
        store.dispatch(setTopDestination(result.datas[0]));
    } catch (error) {
        console.log(error);
    }
}

export { fetchDestination,
        fetchPacks,
        fetchDestinationImages, 
        fetchLodgingImages,
        fetchBestPromoPack,
        fetchTopDestination
    };