const knex = require("../db/connection");

// list reservations by date, sorted by time
function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date})
        .orderBy("reservation_time");
}

// post a new reservation
function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

// reads a reservation by reservation_id
function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .then((returnedRecords) => returnedRecords[0]);
}

module.exports = {
    list,
    create,
    read,
}
