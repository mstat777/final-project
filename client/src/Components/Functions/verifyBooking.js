import { store } from "../../store";
//import { setErrors } from "../../Components/Pages/Booking/Index";

function verifyBooking(id){
    const state = store.getState();
    const errors = [];

    // on importe le state pour l'utiliser
    const bookingInfo = state.booking.bookingInfo;
    console.log(bookingInfo);

    bookingInfo.nb_adults.activities.map((el, idx) => {
        bookingInfo.nb_adults.activities[idx] > bookingInfo.nb_adults.pack && errors.push("le nombre d'adultes dans les activités ne peut pas dépasser le nombre d'adultes inscrits à ce pack !");
    });
    bookingInfo.nb_children.activities.map((el, idx) => {
        bookingInfo.nb_children.activities[idx] > bookingInfo.nb_children.pack && errors.push("le nombre d'enfants dans les activités ne peut pas dépasser le nombre d'enfants inscrits à ce pack !");
    }); 
    
    return errors;
}

export {verifyBooking};