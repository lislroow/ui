import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
  display: boolean;
  title?: string;
  message?: string;
  details?: string;
}

const initialState: AlertState = {
  display: false,
  message: '',
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<{ title: string; message: string; details: string }>) => {
      return {
        display: true,
        title: action.payload.title,
        message: action.payload.message,
        details: action.payload.details,
      };
    },
    hideAlert: (state) => {
      return {
        ...state,
        display: false,
      };
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;

const storeAlert = configureStore({
  reducer: {
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof storeAlert.getState>;
export type AppDispatch = typeof storeAlert.dispatch;

export default storeAlert;
