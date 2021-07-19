import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";
import { previous, next, today } from "../utils/date-time";
import { Link } from "react-router-dom";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  // if there's a date query in the URL, use that instead of the default of "today"
  const dateQuery = useQuery().get("date");
  if (dateQuery) {
    date = dateQuery;
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // load the reservations by date
  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboard() {
      try {
        setReservationsError(null);
        const response = await listReservations({ date }, abortController.signal);
        setReservations(response);
      } catch (error) {
        setReservations([]);
        setReservationsError(error);
      }
    }
    loadDashboard();
    return () => abortController.abort();
  }, [date]);

  console.log("what is date", date)

   return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <div>
          <Link to={`/dashboard?date=${previous(date)}`}>
            <button type="button">Previous Day</button>
          </Link>
          <Link to={`/dashboard?date=${today()}`}>
            <button type="button">Today</button>
          </Link>
          <Link to={`/dashboard?date=${next(date)}`}>
            <button type="button">Next Day</button>
          </Link>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservations reservations={reservations} />
    </main>
  );
}

export default Dashboard;
