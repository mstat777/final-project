import { setDestinationImages, setLodgingImages } from '../../store/slices/travel';
import { store } from "../../store";

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

export {fetchDestinationImages, 
        fetchLodgingImages};