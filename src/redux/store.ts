import { configureStore } from '@reduxjs/toolkit'
import {cartSlice} from "./cartSlice";

export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>