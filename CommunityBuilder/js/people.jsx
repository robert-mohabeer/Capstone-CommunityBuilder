import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";

export default function PeopleBlock({eventData}) {
    const [rsvps, setRSVPs] = useState([]);

    const rsvplist = eventData.rsvpers.map((rsvp) => (
        <div key={rsvp.rsvpid} className="people-item">
          <p><a href={`/users/${rsvp.owner}`}>{rsvp.owner}</a></p>
        </div>
      ));
      

    return ( 
        <div>
            {rsvplist}
        </div>
    );
}