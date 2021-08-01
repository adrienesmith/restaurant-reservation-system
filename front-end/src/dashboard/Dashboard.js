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

  // formats the date variable to be human readable
  const dateObj = new Date(`${date} PDT`);
  const dateString = dateObj.toDateString();

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
      <div className="headingBar d-md-flex my-3 p-2">
        <h1>Dashboard</h1>
      </div>
      <ErrorAlert error={dashboardError} />
      <div className="d-flex justify-content-center my-3">
        <h4 className="mb-0">Reservations for {dateString}</h4>
      </div>  
      <div className="d-flex justify-content-center mt-3">
        <Link to={`/dashboard?date=${previous(date)}`}>
          <button className="btn btn-dark" type="button">
            <span className="oi oi-arrow-thick-left" />
            &nbsp;Previous Day
          </button>
        </Link>
        <Link to={`/dashboard?date=${today()}`}>
          <button className="btn btn-dark mx-3" type="button">Today</button>
        </Link>
        <Link to={`/dashboard?date=${next(date)}`}>
          <button className="btn btn-dark" type="button">
            Next Day&nbsp;
            <span className="oi oi-arrow-thick-right" />
          </button>
        </Link>
      </div>

      <div className="d-md-flex mb-3">
      <div className="mb-3"> 
        <div className="headingBar my-3 p-2">
            <h2>Reservations</h2>
        </div>
        <Reservations reservations={reservations} />
        </div>
        <div className="mb-3 mx-3"> 
          <div className="headingBar my-3 p-2">
              <h2>Tables</h2>
          </div>
          <Tables tables={tables}/>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
