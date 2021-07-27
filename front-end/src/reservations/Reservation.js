import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Reservation({ reservation_id, first_name, last_name, mobile_number, reservation_time, people }) {
    
    const location = useLocation();

    return (
        <div>
            <h3>{`${first_name} ${last_name}`}</h3>
            <p>Reservation Time: {reservation_time}</p>
            <p>Party Size: {people}</p>
            <p>Phone Number: {mobile_number}</p>
            <div>
            {location.pathname.includes("seat") ? null : (
                <Link to={`/reservations/${reservation_id}/seat`}>
                    <button type="button">Seat</button>
                </Link>
            )}
            </div>
        </div>
    )

}