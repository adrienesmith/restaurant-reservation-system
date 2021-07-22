const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

// validation middleware: checks that reservation_date has a valid date value
function dateIsValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);
  if (date && date > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `reservation_date field formatted incorrectly: ${reservation_date}.`
    });
  }
}

// validation middleware: checks that reservation_time has a valid date value
function timeIsValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const regex = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
  if (regex.test(reservation_time)) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `reservation_time field formatted incorrectly: ${reservation_time}`
    });
  }
}

// validation middleware: checks that the value of people is a number
function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  const partySize = Number.isInteger(people);
  if (partySize) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `people field formatted incorrectly: ${people}. Needs to be a number.`
    });
  }
}

// validation middleware: checks that the reservation_date & reservation_time are not in the past
function notInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservation = new Date(reservation_date).setHours(reservation_time.substring(0, 2), reservation_time.substring(3));
  const now = new Date().getTime();
  if (reservation > now) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be in the future."
    });
  }
}


// validation middleware: checks that the reservation_date is not a Tuesday
function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const day = date.getDay();
  if (day === 1) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesday."
    });
  } else {
    return next();
  }
}


// validation middleware: checks that the reservation_time is during operating hours
function duringOperatingHours(req, res, next) {
  const { reservation_time } = req.body.data;
  const open = 1030;
  const close = 2130;
  const reservation = reservation_time.substring(0, 2) + reservation_time.substring(3);
  if (reservation > open && reservation < close) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservations are only allowed between 10:30am and 9:30pm"
    });
  }
}

// validation middleware: checks that the selected date has reservations
async function dateHasReservations(req, res, next) {
  const { date } = req.query;
  const data = await service.list(date);
  if (data.length) {
    res.locals.date = data;
    return next();
  } else {
    return next({
      status: 404, 
      message: `There are currently no reservations for ${date}`,
    });
  }
}

// validation middleware to check if a reservation_id exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const data = await service.read(reservationId);
  if (data) {
    res.locals.reservation = data;
    return next();
  } else {
    return next({
      status: 404,
      message: "reservation_id does not exist."
    });
  }
}

// list reservations by date
async function list(req, res) {
  const { date } = res.locals;
  res.json({ data: date });
}

// creates a reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

// reads a reservation by reservation_id
async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

module.exports = {
  list: [dateHasReservations, asyncErrorBoundary(list)],
  create: [
    hasProperties(...VALID_PROPERTIES), 
    hasOnlyValidProperties(...VALID_PROPERTIES), 
    dateIsValid,
    timeIsValid,
    peopleIsNumber,
    notTuesday,
    notInPast,
    duringOperatingHours,
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(read)
  ],
};
