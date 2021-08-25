import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";

import { createStoreon } from 'storeon'
import { StoreContext } from 'storeon/react'
import { queue } from './queue'


// Init VK  Mini App
bridge.send("VKWebAppInit");

export const store = createStoreon([queue])


ReactDOM.render(<StoreContext.Provider value={store}><App /></StoreContext.Provider>, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
