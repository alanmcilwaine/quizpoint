/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./main/App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
