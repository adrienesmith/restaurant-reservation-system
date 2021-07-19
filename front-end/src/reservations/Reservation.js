import React from "react";

export default function Reservation({ first_name, last_name, mobile_number, reservation_time, people }) {
    return (
        <div>
            <h3>{`${first_name} ${last_name}`}</h3>
            <p>Reservation Time: {reservation_time}</p>
            <p>Party Size: {people}</p>
            <p>Phone Number: {mobile_number}</p>
        </div>
    )

}