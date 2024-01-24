import { store } from "../../store";
import { setCoordinates } from "../../store/slices/travel";

// function pour trouver le prix du pack le moins cher :
function cheapestPack(packs) {
    return Math.min(...packs.map(pack => parseInt(pack.price_adults)))
}

// récupérer juste la date du format DATETIME :
function formatDate(date) {
    const tempDate = new Date(date).toLocaleString("fr-FR").slice(0,10);
    return tempDate;
}

// formatter les dates du format DATE (ça corrige le bug '-1 jour') (pour les inputs préremplis):
function correctDate(date) {
    const oldDate = new Date(date);
    const timeOffset = oldDate.getTimezoneOffset();
    const correctDate = new Date(oldDate.getTime() - (timeOffset*60*1000));
    const newDate = correctDate.toISOString().split('T')[0];
    return newDate;
}

// récupérer et formatter les coordonnées de l'hébergement pour l'afficher dans la carte :
function formatCoordinates(coordinates){
    const tempArray = (coordinates).split(", ");
    tempArray[0] = Math.round(tempArray[0] * 1000000) / 1000000;
    tempArray[1] = Math.round(tempArray[1] * 1000000) / 1000000;
    store.dispatch(setCoordinates([tempArray[0],tempArray[1]]));
}

export { cheapestPack,
         formatDate,
         correctDate,
         formatCoordinates }