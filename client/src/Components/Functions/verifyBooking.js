import { store } from "../../store";

// cette fonction cherche et retourne un tableau d'erreurs
function verifyBooking(){
    const errors = [];

    const state = store.getState();
    
    // on importe le state pour l'utiliser
    const bookingInfo = state.booking.bookingInfo;

    bookingInfo.nb_adults.activities.map((el, i) => {
        bookingInfo.nb_adults.activities[i] > bookingInfo.nb_adults.pack && errors.push("le nombre d'adultes dans les activités ne peut pas dépasser le nombre d'adultes inscrits à ce pack !");
    });
    bookingInfo.nb_children.activities.map((el, i) => {
        bookingInfo.nb_children.activities[i] > bookingInfo.nb_children.pack && errors.push("le nombre d'enfants dans les activités ne peut pas dépasser le nombre d'enfants inscrits à ce pack !");
    }); 
    
    return errors;
}

export {verifyBooking};