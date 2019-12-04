import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import App from './App.jsx';
import {
    Provider
} from 'react-redux';
import store from './Store/store';

ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));