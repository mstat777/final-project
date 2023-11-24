import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/user";
import cartReducer from "./slices/cart";
import allTravelReducer from "./slices/travel";
import bookingReducer from "./slices/booking";
import dashboardReducer from "./slices/dashboard";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        allTravel: allTravelReducer,
        booking: bookingReducer,
        dashboard: dashboardReducer
    }
});

export { store };