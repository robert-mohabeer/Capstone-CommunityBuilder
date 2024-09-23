import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";
import { useParams } from 'react-router-dom';

export default function Profile() {
    let { username } = useParams();
    return ( 
        <div>
            hello {username}!
            Profile
            Coming soon...
        </div>
    );
}