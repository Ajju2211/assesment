import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer, { logout } from '../features/user/userSlice';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { opstechServerAPI } from '../services/api';


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({ user: userReducer, [opstechServerAPI.reducerPath]: opstechServerAPI.reducer })

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(opstechServerAPI.middleware),
});

export const persistor = persistStore(store)

export const dispatcher = store.dispatch

export const logOut = () => {
  store.dispatch(logout())
  persistor.purge()
  window.location.reload()
}
// persistor.purge() for clearing the entire storage used for logouts