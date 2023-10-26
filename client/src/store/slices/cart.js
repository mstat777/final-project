import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    cartInfo: JSON.parse(localStorage.getItem("cart")) || {
        buyer: null,
        bookings: {}
    }
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cartInfo.buyer   = action.payload;
            state.cartInfo.bookings = action.payload;
        }
    }
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;