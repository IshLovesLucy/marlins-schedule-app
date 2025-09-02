import { configureStore } from '@reduxjs/toolkit';
import { mlbApi } from './api/mlbApi';

export const store = configureStore({
    reducer: {
        [mlbApi.reducerPath]: mlbApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(mlbApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
