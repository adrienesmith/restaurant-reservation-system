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
        <div className="card mb-3">
            <h5 className="card-header">{`${first_name} ${last_name}`}</h5>
            <div className="card-body">
            <p>Reservation Time: {reservation_time}<br />
                Party Size: {people}<br />
                Phone Number: {mobile_number}</p>
            <p data-reservation-id-status={reservation_id}>Status: {status}</p>
            {!location.pathname.includes("seat") && status === "booked" ? (
                <>
                    <Link to={`/reservations/${reservation_id}/seat`}>
                    <button href={`/reservations/${reservation_id}/seat`} className="btn btn-dark mr-3" type="button">Seat</button>
                    </Link>
                    <Link to={`/reservations/${reservation_id}/edit`}>
                        <button className="btn btn-dark mr-3" type="button">Edit</button>
                    </Link>
                    <button 
                        className="btn btn-dark"
                        type="button" 
                        onClick={cancelHandler}
                        data-reservation-id-cancel={reservation_id}
                    >
                        Cancel
                    </button>
                </>
                ) : null
            }
            </div>
        </div>
    );
}