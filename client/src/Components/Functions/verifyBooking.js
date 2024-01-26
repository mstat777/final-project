import { store } from "../../store";

// cette fonction cherche et retourne un tableau d'erreurs
function verifyBooking(chosenPack, activities, checkBoxes, modify){
    const errors = [];
    const state = store.getState();
    const bookingInfo = state.booking.bookingInfo;
    const bookedData = state.booking.bookedData;

    // vérfier si suffisamment de places dispo pour pouvoir réserver le pack :
    if (bookingInfo.nbAdults.pack + bookingInfo.nbChildren.pack > chosenPack.places_left) {
        errors.push(`Il ne reste que ${chosenPack.places_left} places. Veuillez modifier le nombre de personnes pour lesquels vous réservez.`);
    }
    // vérfier si c'est réservé pour au moins 1 personne :
    if (bookingInfo.nbAdults.pack + bookingInfo.nbChildren.pack < 1) {
        errors.push(`Vous n'avez pas indiqué le nombre de personnes.`);
    }
    // vérification des activités
    checkBoxes.forEach((el, i) => {
        // vérifier pour chaque activité si le nb d'ad./enf. de l'activité dépasse le nb d'ad./enf. du pack
        bookingInfo.nbAdults.activities[i] > bookingInfo.nbAdults.pack && errors.push("Le nombre d'adultes dans les activités ne peut pas dépasser le nombre d'adultes inscrits à ce pack !");
        bookingInfo.nbChildren.activities[i] > bookingInfo.nbChildren.pack && errors.push("Le nombre d'enfants dans les activités ne peut pas dépasser le nombre d'enfants inscrits à ce pack !");
        // vérfier si suffisamment de places dispo pour pouvoir réserver les activités :    
        if (bookingInfo.nbAdults.activities[i] + bookingInfo.nbChildren.activities[i] > activities[i].places_left) {
            errors.push(`Il ne reste que ${activities[i].places_left} places. Veuillez modifier le nombre de personnes pour lesquels vous réservez.`);
        }
        // message si case cochée, mais nb de personnes pas précisé :
        if (checkBoxes[i]) {
            if (bookingInfo.nbAdults.activities[i] + bookingInfo.nbChildren.activities[i] === 0) {
                errors.push(`Veuillez indiquer le nombre de personnes pour lesquels vous souhaitez réserver l'activité sélectionnée. Si vous ne souhaitez pas réserver cette activité, décochez la case.`);
            }
        }
    }); 

    // UNIQUEMENT dans le cas de modif d'une réservation déjà validée/payée :
    if (modify === "modify") {
        if (bookedData.datasBook[0].status === "validée") {
            // si montant négatif (à rembourser) :
            if (bookingInfo.prices.totalAll - bookedData.datasBook[0].price_total_booking < 0) {
                errors.push("Cette réservation a déjà été payée. Nous ne pouvons pas vous faire rembourser.");
            }
            // si moins de personnes indiquées dans le pack:
            if (bookingInfo.nbAdults.pack < bookedData.datasBook[0].nb_adults ||
            bookingInfo.nbChildren.pack < bookedData.datasBook[0].nb_children) {
                errors.push(`Vous avez déjà payé. Il n'est pas possible de réduire le nombre de personnes.`);
            }
        }
    }
    
    return errors;
}

export {verifyBooking};