import React from "react";

export default function Table({ table, table_name, capacity, status }) {
    return (
        <div>
            <h4>Table {table_name}</h4>
            <p>Capacity: {capacity}</p>
            <p data-table-id-status={table.table_id}>Status: {status}</p>
        </div>
    )

}