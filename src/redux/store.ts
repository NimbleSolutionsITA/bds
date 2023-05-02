import { configureStore } from '@reduxjs/toolkit'
import {settingsSlice} from "./settingsSlice";

export const store = configureStore({
    reducer: {
        settings: settingsSlice.reducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>