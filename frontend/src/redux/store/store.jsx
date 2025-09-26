import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import courseReducer from "../courseSlice";
import batchReducer from "../batchSlice";
import studentReducer from "../studentSlice";
import projectReducer from "../projectSlice";
import attendanceReducer from "../attendenceSlice";
import inventoryItemReducer from "../inventoryItemSlice";
import inventoryTransactionReducer from "../inventoryTransactionSlice";
import paymentReducer from "../paymentSlice";
import invoiceReducer from "../invoiceSlice";
import ledgerReducer from '../ledgerSlice'
import enrollmentReducer from "../enrollmentSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    batch: batchReducer,
    student: studentReducer,
    project: projectReducer,
    attendance: attendanceReducer,
    inventoryItem: inventoryItemReducer,
    inventoryTransaction: inventoryTransactionReducer,
    payment: paymentReducer,
    invoice: invoiceReducer,  // ✅ New
    ledger: ledgerReducer,
    enrollment: enrollmentReducer,
  },
});
