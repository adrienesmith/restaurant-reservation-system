import React from "react";
import Reservation from "./Reservation";

export default function Reservations({ reservations }) {

    const list = reservations.map(reservation => {
        return <Reservation 
            key={reservation.reservation_id}
            reservation_id={reservation.reservation_id}
            first_name={reservation.first_name}
            last_name={reservation.last_name}
            mobile_number={reservation.mobile_number}
            reservation_time={reservation.reservation_time}
            people={reservation.people}
            status={reservation.status}
        />
    });

    return(
        <div>
            {list}
        </div>
    );

}