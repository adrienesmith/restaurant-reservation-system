import React from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
// defines the New Reservation page
export default function EditReservation() {

    const { reservation_id } = useParams();

    return (
        <section>
            <h2>Edit Reservation</h2>
            <ReservationForm reservation_id={reservation_id} />
        </section>
    );
}
