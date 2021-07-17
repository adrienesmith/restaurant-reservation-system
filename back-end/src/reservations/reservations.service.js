const knex = require("../db/connection");

// list reservations by date
function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date});
}

// post a new reservation
function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

module.exports = {
    list,
    create,
}
