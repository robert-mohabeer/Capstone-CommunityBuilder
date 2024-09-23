// Filename - App.js
 
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./home";
import CreateEvent from "./createEvent";
import EventDetails from "./eventdetails";
import Profile from "./profile"
import Map from "./map"
 
function App() {
    return (
        <Router>
            <Routes>
                hello!
                <Route exact path="/" element={<Home />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/event/:eventId" element={<EventDetails />} />
                <Route path="/users/:username" element={<Profile />} />
                <Route path="/map" element={<Map />} />
            </Routes>
        </Router>
    );
}
 
export default App;