import { store } from "../../store";
import { setCoordinates } from "../../store/slices/travel";

// function pour trouver le prix du pack le moins cher :
function cheapestPack(packs) {
    return Math.min(...packs.map(pack => parseInt(pack.price_adults)))
}

// récupérer et formatter les coordonnées de l'hébergement pour l'afficher dans la carte :
function formatCoordinates(coordinates){
    //console.log("coordinates = "+coordinates);
    const tempArray = (coordinates).split(", ");
    //console.log("tempArray = "+tempArray);
    tempArray[0] = Math.round(tempArray[0] * 1000000) / 1000000;
    tempArray[1] = Math.round(tempArray[1] * 1000000) / 1000000;
    //console.log("tempArray[0] = "+tempArray[0]);
    //console.log("tempArray[1] = "+tempArray[1]);
    store.dispatch(setCoordinates([tempArray[0],tempArray[1]]));
}

export { cheapestPack,
         formatCoordinates }