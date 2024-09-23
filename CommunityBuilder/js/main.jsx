import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("hello from main")

// Create a root
const root = createRoot(document.getElementById("reactEntry"));
root.render(<App />);