import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web


// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};


// Combine your reducers
const rootReducer = combineReducers({
  authSlice: authSlice, // Your authSlice is now part of rootReducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Create the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});


// Create a persistor
const persistor = persistStore(store);


export { store, persistor };