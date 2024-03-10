import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Grommet } from 'grommet';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';

const theme = {
  global: {
    font:{
      family: "Roboto",
      size:"18px"
    },
  },
}

const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <Grommet theme={theme}>
      <App />
      </Grommet>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();