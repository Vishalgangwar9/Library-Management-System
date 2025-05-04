import "./adminhome.scss";
import { BarChart, CountCard, Loader, PieChart } from "../../../components";
import { useEffect, useState } from "react";
import { STATUSES, getAdminDashboardStats } from "../../../http";
import { formatDate } from "../../../utils/formatDate";

const AdminHome = () => {
  const [status, setStatus] = useState(STATUSES.IDLE);
  const [data, setData] = useState({
    last5IssuedBooks: [],
    last5ReturnedBooks: [],
    last12MonthsData: {},
    numberOfAvailableBooks: 0,
    numberOfBorrowedBooks: 0,
    numberOfEBooks: 0,
    numberOfReservedBooks: 0,
    numberOfTotalBooks: 0,
    statusCounts: {},
  });

  const fetchData = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const response = await getAdminDashboardStats();
      setData(response.data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      setStatus(STATUSES.ERROR);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (status === STATUSES.LOADING) {
    return <Loader />;
  }

  if (status === STATUSES.ERROR) {
    return <p>Failed to load data. Please try again later.</p>;
  }

  return (
    <div className="admin__home__container">
      {/* COUNTER CARDS */}
      <div className="card__wrapper">
        <CountCard
          heading={"Total Books"}
          count={data.numberOfTotalBooks}
          link={"manage-books"}
        />
        <CountCard
          heading={"Issued Books"}
          count={data.numberOfBorrowedBooks}
          link={"manage-issued-books"}
        />
        <CountCard
          heading={"Reserved Books"}
          count={data.numberOfReservedBooks}
          link={"reserved-books-list"}
        />
        <CountCard
          heading={"Total Ebooks"}
          count={data.numberOfEBooks}
          link={"manage-ebooks"}
        />
      </div>

      {/* BAR AND PIE CHART */}
      <div className="chart__wrapper">
        <div className="barchart__container">
          <BarChart
            title="Number of Borrowed Books Chart"
            labels={Object.keys(data.last12MonthsData).reverse()}
            values={Object.values(data.last12MonthsData).reverse()}
            label="Borrowed Books"
          />
        </div>
        <div className="piechart__container">
          <PieChart
            labels={Object.keys(data.statusCounts)}
            values={Object.values(data.statusCounts)}
            title="Book Status Chart"
            label="Status"
          />
        </div>
      </div>

      {/* LAST 5 ISSUED BOOKS */}
      <h2 className="table__title">Last 5 Issued Books</h2>
      <div className="table__wrapper bg__accent">
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr className="bg__secondary">
              <td>No#</td>
              <td>Member Name</td>
              <td>Book Title</td>
              <td>Issued Date</td>
              <td>Due Date</td>
            </tr>
          </thead>
          <tbody>
            {data.last5IssuedBooks.length === 0 ? (
              <tr>
                <td colSpan="5">No issued books available.</td>
              </tr>
            ) : (
              data.last5IssuedBooks.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td>{index + 1}</td>
                  <td>{transaction.user?.name ?? "N/A"}</td>
                  <td>{transaction.book?.title ?? "N/A"}</td>
                  <td>{formatDate(transaction.borrowDate)}</td>
                  <td>{formatDate(transaction.dueDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* LAST 5 RETURNED BOOKS */}
      <h2 className="table__title">Last 5 Returned Books</h2>
      <div className="table__wrapper bg__accent">
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr className="bg__secondary">
              <td>No#</td>
              <td>Member Name</td>
              <td>Book Title</td>
              <td>Issued Date</td>
              <td>Returned Date</td>
            </tr>
          </thead>
          <tbody>
            {data.last5ReturnedBooks.length === 0 ? (
              <tr>
                <td colSpan="5">No returned books available.</td>
              </tr>
            ) : (
              data.last5ReturnedBooks.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td>{index + 1}</td>
                  <td>{transaction.user?.name ?? "N/A"}</td>
                  <td>{transaction.book?.title ?? "N/A"}</td>
                  <td>{formatDate(transaction.borrowDate)}</td>
                  <td>{formatDate(transaction.returnedDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
