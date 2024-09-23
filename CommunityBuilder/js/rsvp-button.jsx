// import { method } from "cypress/types/bluebird";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// use numLikes directly! do not make a State variable
export default function RsvpButton({
    rsvped,
    onClick,
    numPeople,
    eventId,
}) {

    console.log("rsvp: ", rsvped)

  return (
    <div>
        <button id={'button-event'+eventId} onClick={onClick}>{rsvped ? "RSVP" : "un-RSVP"}</button>
        <p>{numPeople} people have rsvped</p>
    </div>
  )};

  Event.propTypes = {
    rsvped: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    numPeople: PropTypes.number.isRequired,
    eventId: PropTypes.number.isRequired,
  };