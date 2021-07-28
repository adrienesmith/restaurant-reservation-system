import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { updateStatus } from "../utils/api";

export default function Reservation({ reservation_id, first_name, last_name, mobile_number, reservation_time, people, status }) {
    
    const [cancelError, setCancelError] = useState([]);
    const location = useLocation();
    const history = useHistory();

    const cancelHandler = (event) => {
        event.preventDefault();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            const abortController = new AbortController();
            // PUT request
            async function cancel() {
                try {
                    await updateStatus(reservation_id, "cancelled", abortController.signal);
                    history.go(0);
                } catch (error) {
                    setCancelError([...cancelError, error.message]);
                }
            }
            if (cancelError.length === 0) {
                cancel();
            }
        }
    }

    return (
        <div>
            <h3>{`${first_name} ${last_name}`}</h3>
            <p>Reservation Time: {reservation_time}</p>
            <p>Party Size: {people}</p>
            <p>Phone Number: {mobile_number}</p>
            <p data-reservation-id-status={reservation_id}>Status: {status}</p>
            <div>
            {!location.pathname.includes("seat") && status === "booked" ? (
                <Link to={`/reservations/${reservation_id}/seat`}>
                    <button type="button">Seat</button>
                </Link>
                ) : null
            }
            {status === "booked" ? (
                <Link to={`/reservations/${reservation_id}/edit`}>
                    <button type="button">Edit</button>
                </Link>
            ) : null
            }

                <button 
                    type="button" 
                    onClick={cancelHandler}
                    data-reservation-id-cancel={reservation_id}
                >
                    Cancel
                </button>
            </div>
        </div>
    )

}