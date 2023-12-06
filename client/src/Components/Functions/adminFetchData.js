import { store } from "../../store";
import { setResults } from "../../store/slices/dashboard";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// rechercher une réservation par le nom de famille d'utilisateur ( A SUPPRIMER ) :
async function fetchBookingByLastName(fName) {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/admin/booking/last-name/${fName}`)).json();
        store.dispatch(setResults(result.datas));
        console.log("adminFetchData.js called");
    } catch (error) {
        console.log(error);
    }
}
// rechercher une réservation par le nom de famille d'utilisateur :
async function fetchBookings({inputs}) {
    try {
        /*const { lastName,
            firstName,
            email,
            reference,
            bookingDate } = inputs;*/
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/admin/bookings`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                inputs
                /*lastName,
                firstName,
                email,
                reference,
                bookingDate*/
            })
        })).json();
        store.dispatch(setResults(result.datas));
        console.log("adminFetchData.js called");
    } catch (error) {
        console.log(error);
    }
}

export {
    fetchBookingByLastName,
    fetchBookings
}