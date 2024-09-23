// import { method } from "cypress/types/bluebird";
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

// use numLikes directly! do not make a State variable
export default function MapMarker({
    eventid,
    url
}) {

    const LeafIcon = L.Icon.extend({
        options: {}
      });
    
    const sunIcon = new LeafIcon({
            iconUrl: '../static/images/sun-marker.png',
        
            iconSize:     [100, 100], // size of the icon
            iconAnchor:   [50, 100], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -100] // point from which the popup should open relative to the iconAnchor
        });

        const defaultIcon = new LeafIcon({
            iconUrl: '../static/images/black-marker.png',
        
            iconSize:     [60, 60], // size of the icon
            iconAnchor:   [30, 60], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
        });
    

        const [icon, setIcon] = useState(defaultIcon)
        const [rsvpStatus, changeRsvpStatus] = useState(false)
    const [markerData, setMarker] = useState({
        eventid: 0,
        location: "hi",
        title: "hi",
        mapcoord1: 0,
        mapcoord2: 0
    })
    function fetchEvent(url){
        console.log("url: ", url)
        fetch(url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            const marker = {
                eventid: data.eventid,
                location: data.location,
                title: data.title,
                mapcoord1: data.mapcoord1,
                mapcoord2: data.mapcoord2,
            }
            console.log("data: ", data)
            console.log("marker: ", marker)
            changeRsvpStatus(data.rsvped)
            setMarker(marker)
            setIcon(data.rsvped ? sunIcon : defaultIcon)

        })
        .catch((error) => console.log(error));
    }

    useEffect(() => {
        console.log("fetching...")
        fetchEvent(url)
      }, [url]);

      const RSVPChange = (id) => {
        if(rsvpStatus != true){
            setIcon(sunIcon)
            fetch(`/api/v1/rsvps/?eventid=${id}`, {
            method: "POST",
            headers: { "credentials": "same-origin" }});
        } else {
            setIcon(defaultIcon)
            fetch(`/api/v1/rsvps/${id}`, {
            method: "DELETE",
            headers: { "credentials": "same-origin" }});
        }
        changeRsvpStatus(!rsvpStatus) 
        // make post request to chnage rsvped status of event...
    }


  return (
    <div className="marker">
        { markerData.mapcoord1 ? <Marker position={[markerData.mapcoord1, markerData.mapcoord2]} icon={icon}>
            <Popup>
            <button onClick={()=> {RSVPChange(markerData.eventid)}}>{!rsvpStatus ? "RSVP" : "un-RSVP"}</button>
            <Link to={`/event/${markerData.eventid}`}>
                <div className="event-title">{markerData.title}</div>
            </Link> <br /> {markerData.location}
            </Popup>
        </Marker> : <></>}
    </div>
  )};

  Event.propTypes = {
    title: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    mapcoord1: PropTypes.number.isRequired,
    mapcoord1: PropTypes.number.isRequired
  };