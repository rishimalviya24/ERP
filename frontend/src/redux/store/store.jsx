import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../authSlice';
import courseReducer from '../courseSlice';
import batchReducer from '../batchSlice'

export const store = configureStore({
    reducer : {
        auth : authReducer,
        course: courseReducer,
        batch: batchReducer,
    }
})