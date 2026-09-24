import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './../assets/style/paletteStyle.css';
import './../assets/style/login.css';
import './../assets/style/navigation/footer.css';
import './../assets/style/navigation/header+sidebar.css'
import './../assets/style/home/dashBoard.css';
import './../assets/style/home/home.css';
import './../assets/style/tools/loader.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);