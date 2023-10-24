import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/user";
import cartReducer from "./slices/cart";
import allTravelReducer from "./slices/travel";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        allTravel: allTravelReducer
    }
});

export { store };