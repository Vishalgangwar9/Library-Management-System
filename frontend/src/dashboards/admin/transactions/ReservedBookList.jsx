import React, { useEffect, useState } from "react";
import { exportBooks, getAllReservedBooks } from "../../../http";
import { toast } from "react-hot-toast";
import { Pagination } from "../../../components";
import { formatDate } from "../../../utils/formatDate";

const ReservedBookList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});

  const handleExport = () => {
    const promise = exportBooks();
    toast.promise(promise, {
      loading: "Exporting...",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Books Exported successfully";
      },
      error: (err) => {
        console.error("Export error:", err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllReservedBooks(currentPage);
      console.log("Fetched data:", data);
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch reserved books.");
    }
  };

  // FETCH DATA WHEN CURRENT PAGE CHANGES
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Reserved Books</h2>
        <button className="btn btn__primary" onClick={handleExport}>
          Export Books
        </button>
      </div>

      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ISBN</td>
              <td>Title</td>
              <td>User Name</td>
              <td>Roll Number/Email</td>
              <td>Reserved Date</td>
            </tr>
          </thead>
          <tbody>
            {data?.books?.map((i) => (
              <tr key={i._id}>
                <td>{i?.book?.ISBN}</td>
                <td>{i.book?.title}</td>
                <td>{i.user?.name}</td>
                <td>
                  {i.user?.rollNumber ? (
                    <span>{i.user?.rollNumber}</span>
                  ) : (
                    <span>{i?.user?.email}</span>
                  )}
                </td>
                <td>{formatDate(i?.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={data}
      />
    </div>
  );
};

export default ReservedBookList;
