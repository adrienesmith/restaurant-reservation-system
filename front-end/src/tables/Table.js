import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Table({ table, table_name, capacity, status }) {

    const [finishError, setFinishError] = useState([]);

    const history = useHistory();

    const finishHandler = (event) => {
        event.preventDefault();
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            const abortController = new AbortController();
            // DELETE request
            async function finish() {
                try {
                    await finishTable(table.table_id, abortController.signal);
                    history.go(0);
                } catch (error) {
                    setFinishError([...finishError, error.message]);
                }
            }
            if (finishError.length === 0) {
                finish();
            }
        }
    }

    return (
        <div className="card mb-3">
            <ErrorAlert error={finishError} />
            <h5 className="card-header">Table {table_name}</h5>
            <div className="card-body">
                <p>Capacity: {capacity}</p>
                <p data-table-id-status={table.table_id}>Status: {status}</p>
                {status === "Free" ? null : (
                <button data-table-id-finish={table.table_id} className="btn btn-dark" type="button" onClick={finishHandler}>Finish</button>
                )}
            </div>
        </div>
    );
}