import React from "react";
import Reservation from "./Reservation";

export default function Reservations({ reservations }) {

    const sort = reservations.sort((a, b) => {
        return a.reservation_time > b.reservation_time ? 1 : -1;
    });

    const list = sort.map(reservation => {
        return <Reservation 
            key={reservation.reservation_id}
            first_name={reservation.first_name}
            last_name={reservation.last_name}
            mobile_number={reservation.mobile_number}
            reservation_time={reservation.reservation_time}
            people={reservation.people}
        />
    });

    return(
        <div>
            {list}
        </div>
    );

}