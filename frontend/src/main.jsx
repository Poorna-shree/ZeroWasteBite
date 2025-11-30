import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from './redux/store.js';

import UserContext from './context/userContext.jsx';   // ✅ Capital letter
import AuthContext from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthContext>
        <UserContext>
          <App />
        </UserContext>
      </AuthContext>
    </Provider>
  </BrowserRouter>
);
