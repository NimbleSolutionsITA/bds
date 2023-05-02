import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {i18n} from "../types/settings";

type SettingsType = {

}

const initialState = {

}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {

	},
})

// Action creators are generated for each case reducer function
export const {  } = settingsSlice.actions

export default settingsSlice.reducer