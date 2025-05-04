import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./books.scss";
import { AiOutlineSearch } from "react-icons/ai";
import defaultCover from "../../assets/cover404.jpg";
import { BASE_URL, getAllCategoriesWithoutPagination, getAllEBooks } from "../../http";
import Stars from "../../components/website/stars/Stars";
import { Pagination } from "../../components";

const EBooks = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [categories, setCategories] = useState([]);
  const [booksData, setBooksData] = useState(null);
  const [query, setQuery] = useState({ ISBN: "", title: "", category: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEBooks(query, currentPage, 10);
      const categoriesResponse = await getAllCategoriesWithoutPagination();
      setBooksData(response.data);
      setCategories(categoriesResponse.data?.categories || []);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [query, currentPage]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setCurrentPage(1);

    // Debounce search to prevent rapid firing of requests
    const handler = setTimeout(() => {
      fetchData();
    }, 500); // Reducing debounce time for a quicker response

    return () => {
      clearTimeout(handler);
    };
  }, [query, fetchData]);

  useEffect(() => {
    fetchData();
  }, [currentPage, fetchData]);

  return (
    <div className="books__wrapper bg text__color">
      <div className="sidebar__wrapper bg__accent">
        <div className="sidebar__content">
          <h3>Categories</h3>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={query?.category === ""}
                  onChange={() => setQuery({ ...query, category: "" })}
                />
                All
              </label>
            </li>
            {categories.map((category) => (
              <li key={category._id}>
                <label>
                  <input
                    type="checkbox"
                    name="category"
                    checked={query.category === category._id}
                    onChange={() => setQuery({ ...query, category: category._id })}
                  />
                  {category.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="left">
            <h3>EBOOKS</h3>
            <p>List of digital books</p>
          </div>
          <form className="input__box bg__accent" tabIndex="0">
            <input
              type="text"
              placeholder="Search books..."
              value={query.title}
              onChange={(e) => setQuery({ ...query, title: e.target.value })}
              aria-label="Search for books by title"
            />
            <AiOutlineSearch />
          </form>
        </div>

        <section className="books__section">
          {loading ? (
            <div className="loading">Loading books...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <div className="card__wrapper">
                {booksData?.books.length ? (
                  booksData.books.map((book) => (
                    <div className="card bg__accent" key={book._id}>
                      <img
                        src={book.imagePath ? `${BASE_URL}/${book.imagePath}` : defaultCover}
                        alt="Book cover"
                        loading="lazy"
                      />
                      <div className="content">
                        <h5>{book.title}</h5>
                        <p>By {book.author}</p>
                        <Stars rating={book.rating} />
                        <p>{book.totalReviews} Reviews | {book.rating} out of 5</p>
                        <div className="action">
                          <Link className="btn btn__secondary" to={`/ebooks/${book._id}`}>
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 style={{ margin: "20px auto" }}>Book Not Found</h1>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                data={booksData}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default EBooks;
