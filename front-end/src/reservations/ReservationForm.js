import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { postReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationForm() {
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }

    const [form, setForm] = useState({...initialFormState});
    const [reservationsError, setReservationsError] = useState(null);

    const handleChange = ({ target }) => {
        setForm({
            ...form,
            [target.name]: target.value,
        });
    }

    const abortController = new AbortController();

    const handleSubmit = (event) => {
        event.preventDefault();
        async function postData() {
            try {
                await postReservation(form, abortController.signal);
                history.push("/reservations");
            } catch (error) {
                setReservationsError(error);
            }
        }
        postData();
    }

    const history = useHistory();

    return (
            <>
            <ErrorAlert error={reservationsError} />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name">First Name</label>
                    <input 
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="First Name"
                        onChange={handleChange}
                        required="required"
                        value={form.first_name}
                    />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name</label>
                    <input 
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Last Name"
                        onChange={handleChange}
                        required="required"
                        value={form.last_name}
                    />
                </div>
                <div>
                    <label htmlFor="mobile_number">Mobile Phone Number</label>
                    <input 
                        type="text"
                        name="mobile_number"
                        id="mobile_number"
                        placeholder="555-555-5555"
                        onChange={handleChange}
                        required="required"
                        value={form.mobile_number}
                    />
                </div>
                <div>
                    <label htmlFor="reservation_date">Reservation Date</label>
                    <input 
                        type="date"
                        name="reservation_date"
                        id="reservation_date"
                        onChange={handleChange}
                        required="required"
                        value={form.reservation_date}
                    />
                </div>
                <div>
                <label htmlFor="reservation_time">Reservation Time</label>
                    <input 
                        type="time"
                        name="reservation_time"
                        id="reservation_time"
                        onChange={handleChange}
                        required="required"
                        value={form.reservation_time}
                    /> 
                </div>
                <div>
                    <label htmlFor="people">Number of People in Party</label>
                    <select 
                        type="text"
                        name="people"
                        id="people"
                        placeholder="ex. 7"
                        onChange={handleChange}
                        required="required"
                        value={form.people}
                    >
                        <option value="">-- Select Party Size --</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => history.goBack()}>Cancel</button>
            </form>
        </>
    );

}



