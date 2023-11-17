import { store } from "../../store";
import { setDestination,
        setDestinationImages, 
        setLodgingImages
        } from "../../store/slices/travel";

async function fetchDestinationImages(destinationID){
    try {
        //console.log("destinationID = "+destinationID);
        const result = await(await fetch(`/api/v.0.1/travel/destination/img/all/${destinationID}`)).json();
        console.log(result.datas);
        store.dispatch(setDestinationImages(result.datas));

        const state = store.getState();
        console.log(state.allTravel.destinationImages);
    } catch (error) {
        console.log(error);
    }
}

async function fetchLodgingImages(lodgingID){
    try {
        const result = await(await fetch(`/api/v.0.1/travel/lodging/img/all/${lodgingID}`)).json();
        //console.log(result.datas);
        store.dispatch(setLodgingImages(result.datas));

        const state = store.getState();
        console.log(state.allTravel.lodgingImages);
    } catch (error) {
        console.log(error);
    }
}

// fonction pour supprimer des clés du localstorage
// on passe une liste de clés à supprimer dans un tableau
function deleteLocStorageItems(arrayOfItems) {
    arrayOfItems.forEach(itemName => {
        // vérifier si la clé existe
        localStorage.getItem(`${itemName}`) !== null && localStorage.removeItem(`${itemName}`)
    });
}

async function fetchDestination(destinationInput){
    // on récupère les données de la destination :
    const dataDest = await (await fetch(`/api/v.0.1/travel/destination/${destinationInput}`)).json();

    if(dataDest.datas[0]){
        console.log("la destination a été trouvée dans la BD");
        localStorage.setItem("destination", JSON.stringify(dataDest.datas[0]));
        store.dispatch(setDestination(dataDest.datas[0]));
        console.log("dataDest.datas[0] = "+dataDest.datas[0]);

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

export { fetchDestination,
        fetchDestinationImages, 
        fetchLodgingImages};