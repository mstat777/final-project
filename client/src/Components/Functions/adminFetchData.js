import { store } from "../../store";
import { setResults } from "../../store/slices/dashboard";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// rechercher une réservation par le nom de famille d'utilisateur :
async function fetchBookings({inputs}) {
    try {
        const result = await (await fetch(`${BASE_URL}/api/v.0.1/admin/bookings`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputs })
        })).json();
        store.dispatch(setResults(result.datas));
    } catch (error) {
        console.log(error);
    }
}

export {
    fetchBookings
}