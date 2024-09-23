import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
// import "leaflet/dist/leaflet.css";
import MapMarker from "./mapMarker"

export default function Map() {
    let { username } = useParams();

    const [allEvents, setAllEvents] = useState([])

  function fetchAllEvents() {
    var eventsUrl = "/api/v1/events/"; 
    console.log("url: ", eventsUrl)
    fetch(eventsUrl, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log("data: ", data)
        console.log("Events: ", data.all_events)
        setAllEvents([...data.all_events]);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    fetchAllEvents()
  }, []);


    return ( 
        <div className="map-page">

            <h2>Map View</h2>
            <MapContainer center={[42.2808, -83.7430]} zoom={13} style={{ height: "80vh", width: "60vw" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allEvents.map((x) => (
                    <MapMarker url={x.url} eventid={x.eventid}/>
            ))}
            </MapContainer>
        </div>
    );
}