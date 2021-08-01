import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { postTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm() {

    const initialFormState = {
        table_name: "",
        capacity: "",
    }

    const [form, setForm] = useState({...initialFormState});
    const [reservationsError, setReservationsError] = useState([]);

    const history = useHistory();

    const abortController = new AbortController();

    const handleChange = ({ target }) => {
        let name = target.name;
        let value = target.value;

        // table_name must be at least 2 characters long
        if (name === "table_name") {
            if (value.length < 2) {
                setReservationsError(["Table Name must be at least 2 characters long."]);
            } else {
                setReservationsError([]);
            }
        }

        // capacity must be a number greater than 0
        if (name === "capacity") {
            if (isNaN(value)) {
                setReservationsError(["Capacity must be a number."]);
            } else if (value < 1) {
                setReservationsError(["Capacity must be at least 1."]);
            } else {
                setReservationsError([]);
            }
        }
        // set the form state
        setForm({
            ...form,
            [target.name]: target.value,
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // POST request
        async function postData() {
            try {
                await postTable(form, abortController.signal);
                history.push(`/dashboard`);
            } catch (error) {
                setReservationsError([...reservationsError, error.message]);
            }
        }
        // do not send POST request if there is a pending error message
        if (reservationsError.length === 0) {
            postData();
        }
    }

    return (
        <>
        <ErrorAlert error={reservationsError} />
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="table_name">Table Name</label>
                <input 
                    className="form-control"
                    type="text"
                    name="table_name"
                    id="table_name"
                    onChange={handleChange}
                    required="required"
                    value={form.table_name}
                />
            </div>
            <div className="form-group">
                <label htmlFor="capacity">Table Capacity</label>
                <input 
                    className="form-control"
                    type="number"
                    name="capacity"
                    id="capacity"
                    onChange={handleChange}
                    required="required"
                    value={form.capacity}
                />
            </div>
            <button className="btn btn-dark" type="submit">Submit</button>
            <button className="btn btn-dark mx-3" type="button" onClick={() => history.goBack()}>Cancel</button>
        </form>
    </>
    );
}