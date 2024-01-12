import { store } from "../../store";

// cette fonction cherche et retourne un tableau d'erreurs
function verifyBooking(chosenPack, activities, checkBoxes){
    const errors = [];
    const state = store.getState();
    const bookingInfo = state.booking.bookingInfo;
    // vérfier si suffisamment de places dispo pour pouvoir réserver le pack :
    if (bookingInfo.nb_adults.pack + bookingInfo.nb_children.pack > chosenPack.places_left) {
        errors.push(`Il ne reste que ${chosenPack.places_left} places. Veuillez modifier le nombre de personnes pour lesquels vous réservez.`);
    }
    // vérfier si c'est réservé pour au moins 1 personne :
    if (bookingInfo.nb_adults.pack + bookingInfo.nb_children.pack < 1) {
        errors.push(`Vous n'avez pas indiqué le nombre de personnes.`);
    }
    // vérification des activités
    checkBoxes.forEach((el, i) => {
        // vérifier pour chaque activité si le nb d'ad./enf. de l'activité dépasse le nb d'ad./enf. du pack
        bookingInfo.nb_adults.activities[i] > bookingInfo.nb_adults.pack && errors.push("Le nombre d'adultes dans les activités ne peut pas dépasser le nombre d'adultes inscrits à ce pack !");
        bookingInfo.nb_children.activities[i] > bookingInfo.nb_children.pack && errors.push("Le nombre d'enfants dans les activités ne peut pas dépasser le nombre d'enfants inscrits à ce pack !");
        // vérfier si suffisamment de places dispo pour pouvoir réserver les activités :    
        if (bookingInfo.nb_adults.activities[i] + bookingInfo.nb_children.activities[i] > activities[i].places_left) {
            errors.push(`Il ne reste que ${activities[i].places_left} places. Veuillez modifier le nombre de personnes pour lesquels vous réservez.`);
        }
        // message si case cochée, mais nb de personnes pas précisé :
        if (checkBoxes[i]) {
            if (bookingInfo.nb_adults.activities[i] + bookingInfo.nb_children.activities[i] === 0) {
                errors.push(`Veuillez indiquer le nombre de personnes pour lesquels vous souhatez réserver l'activité sélectionnée.`);
            }
        }
    }); 
    return errors;
}

export {verifyBooking};