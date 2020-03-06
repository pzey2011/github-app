
import React from "react";
import ReactDOM from "react-dom";
import Form from "./js/containers/Form";
import store from "./js/store";
import { Provider } from 'react-redux';

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Provider store={store}><Form /></Provider>, wrapper) : false;
