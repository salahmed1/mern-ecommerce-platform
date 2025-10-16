import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // <-- IMPORT PROVIDER
import store from './redux/store'; // <-- IMPORT OUR STORE
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* WRAP APP WITH THE PROVIDER */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);