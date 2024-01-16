import { store } from "../../store";
import { signout, setFromLocalStorage } from "../../store/slices/user";

// vérifie uniquement le token :
async function getTokenData() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");

    const res = await fetch(`${BASE_URL}/api/v.0.1/user/check-token`, {
        headers: { Authentication: "Bearer " + TOKEN }
    });
    if (res.status === 401) {                      
        localStorage.removeItem("auth");
        store.dispatch(signout());
    }
    if (res.status === 200) {
        const json = await res.json();
        store.dispatch(setFromLocalStorage(json));
    }
}

export { getTokenData }