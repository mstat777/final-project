import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/user";
import cartReducer from "./slices/cart";
import destinationReducer from "./slices/destination";
import allTravelReducer from "./slices/travel";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        destination: destinationReducer,
        allTravel: allTravelReducer
    }
});

export { store };