import React from "react";
import ReservationForm from "./ReservationForm";
// defines the New Reservation page
export default function NewReservation() {

    return (
        <section>
            <div className="headingBar d-md-flex my-3 p-2">
                <h1>New Reservation</h1>
            </div>
            <ReservationForm />
        </section>
    );
}
