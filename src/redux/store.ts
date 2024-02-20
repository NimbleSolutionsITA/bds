import { configureStore } from '@reduxjs/toolkit'
import {cartSlice} from "./cartSlice";
import {layoutSlice} from "./layoutSlice";

export const store = configureStore({
    reducer: {
        layout: layoutSlice.reducer,
        cart: cartSlice.reducer,
    },
})

export type AppDispatch = typeof store.dispatch

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>