const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties");

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const VALID_PROPERTIES = [
  ...REQUIRED_PROPERTIES,
  "status",
  "reservation_id", 
  "created_at", 
  "updated_at",
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
      message: `reservation_date field formatted incorrectly: ${reservation_date}.`,
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
      message: `reservation_time field formatted incorrectly: ${reservation_time}`,
    });
  }
}

// validation middleware: checks that the value of people is a number
function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  const peopleInt = parseInt(people)
  const partySize = Number.isInteger(peopleInt);
  if (partySize) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `people field formatted incorrectly: ${people}. Needs to be a number.`,
    });
  }
}

// validation middleware: checks that the reservation_date & reservation_time are not in the past
function notInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const reservation = new Date(`${reservation_date} PDT`).setHours(reservation_time.substring(0, 2), reservation_time.substring(3));
  const now = Date.now();
  if (reservation > now) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }
}


// validation middleware: checks that the reservation_date is not a Tuesday
function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const day = date.getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesday.",
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
      message: "Reservations are only allowed between 10:30am and 9:30pm",
    });
  }
}

// validation middleware: if a status is included when posting a new reservation, the only status allowed is "booked"
function statusBooked(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status === "booked") {
      return next();
    } else {
      return next({
        status: 400, 
        message: `status cannot be set to ${status} when creating a new reservation.`,
      });
    }
  } else {
    return next();
  }
}



// validation middleware: checks the request query 
// if query is date, check that the selected date has reservations that aren't finished
// if query is mobile_number, look for reservations matching that number
async function byDateOrPhone(req, res, next) {
  const { date, mobile_number } = req.query;
  if (date) {
    const reservations = await service.list(date);
    if (reservations.length) {
      res.locals.data = reservations;
      return next();
    } else {
      return next({
        status: 404, 
        message: `There are currently no pending reservations for ${date}`,
      });
    }
  } 
  if (mobile_number) {
    const reservation = await service.find(mobile_number);
    res.locals.data = reservation;
    return next();
  }
}

// validation middleware: checks if a reservation_id exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const data = await service.read(reservationId);
  if (data) {
    res.locals.reservation = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `reservation_id: ${reservationId} does not exist.`
    });
  }
}

// validation middleware: checks that status type is valid
function statusIsValid(req, res, next) {
  const { status } = req.body.data;
  const validValues = ["booked", "seated", "finished", "cancelled"];
  if (validValues.includes(status)) {
    res.locals.status = status;
    return next();
  } else {
    return next({
      status: 400, 
      message: `invalid status: ${status}. Status must be one of these options: ${validValues.join(", ")}`,
    });
  }
}

// validation middleware: checks that status is not currently finished
function statusIsNotFinished(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400, 
      message: "A finished reservation cannot be updated.",
    });
  } else {
    return next();
  }
}


// list reservations by date
function list(req, res) {
  const { data } = res.locals;
  res.json({ data: data });
}

// creates a reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

// reads a reservation by reservation_id
function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// updates a reservation status
async function updateStatus(req, res) {
  const { reservation, status } = res.locals;
  const updatedReservationData = {
    ...reservation,
    status: status,
  }
  const updatedReservation = await service.update(updatedReservationData);
  res.json({ data: updatedReservation });
}

// updates reservation information
async function updateReservation(req, res) {
  const { reservation } = res.locals;
  const { data } = req.body;
  const updatedReservationData = {
    ...reservation,
    ...data,
  }
  const updatedReservation = await service.update(updatedReservationData);
  res.json({ data: updatedReservation });
}

module.exports = {
  list: [
    asyncErrorBoundary(byDateOrPhone), 
    list,
  ],
  create: [
    hasProperties(...REQUIRED_PROPERTIES), 
    hasOnlyValidProperties(...VALID_PROPERTIES), 
    dateIsValid,
    timeIsValid,
    peopleIsNumber,
    notTuesday,
    notInPast,
    duringOperatingHours,
    statusBooked,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists), 
    read,
  ],
  updateStatus: [
    hasProperties("status"), 
    hasOnlyValidProperties("status"), 
    asyncErrorBoundary(reservationExists), 
    statusIsValid,
    statusIsNotFinished,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    hasProperties(...REQUIRED_PROPERTIES), 
    hasOnlyValidProperties(...VALID_PROPERTIES), 
    asyncErrorBoundary(reservationExists), 
    dateIsValid,
    timeIsValid,
    peopleIsNumber,
    notTuesday,
    notInPast,
    duringOperatingHours,
    asyncErrorBoundary(updateReservation),
  ]
};
