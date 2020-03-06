
import React from "react";
import ReactDOM from "react-dom";
import App from "./js/containers/App";
import store from "./js/store";
import { Provider } from 'react-redux';

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Provider store={store}><App /></Provider>, wrapper) : false;
