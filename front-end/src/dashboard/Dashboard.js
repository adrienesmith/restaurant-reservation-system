import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
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
  const [tables, setTables] = useState([]);
  const [dashboardError, setDashboardError] = useState([]);

  // load the reservations by date
  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboard() {
      try {
        setDashboardError([]);
        const reservationDate = await listReservations({ date }, abortController.signal);
        setReservations(reservationDate);
      } catch (error) {
        setReservations([]);
        setDashboardError([error.message]);
      }
    }
    loadDashboard();
    return () => abortController.abort();
  }, [date]);

  // load all tables
  useEffect(() => {
    const abortController = new AbortController();

    async function loadTables() {
      try {
        setDashboardError([]);
        const tableList = await listTables(abortController.signal);
        setTables(tableList);
      } catch (error) {
        setTables([]);
        setDashboardError([error.message]);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

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
      <ErrorAlert error={dashboardError} />
      <Reservations reservations={reservations} />
      <h2>Tables</h2>
      <Tables tables={tables}/>
    </main>
  );
}

export default Dashboard;
