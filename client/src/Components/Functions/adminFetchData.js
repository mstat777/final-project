import { store } from "../../store";
import { setResults } from "../../store/slices/dashboard";

// rechercher une réservation par le nom de famille d'utilisateur :
async function fetchBookingByLastName(fName) {
    try {
        const result = await (await fetch(`/api/v.0.1/admin/booking/last-name/${fName}`)).json();
        store.dispatch(setResults(result.datas));
        console.log("adminFetchData.js called");
    } catch (error) {
        console.log(error);
    }
}

export {
    fetchBookingByLastName,
}