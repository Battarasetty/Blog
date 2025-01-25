import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from './user/userSlice.js';
import persistReducer from 'redux-persist/lib/persistReducer';
import storage from 'redux-persist/lib/storage'
import { persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    user: UserReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
})

export const persistor = persistStore(store)
