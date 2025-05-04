import React, { useEffect, useState, useMemo, useCallback } from "react";
import image from "../../assets/cover404.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL, STATUSES, createReview, getEBook } from "../../http";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import Stars from "../../components/website/stars/Stars";
import axios from "axios";

const EBookDetail = () => {
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const { _id } = useParams();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isAuth = auth.isAuth;
  
  const fetchBook = useCallback(async () => {
    setStatus(STATUSES.LOADING);
    try {
      const response = await getEBook(_id, auth.token);
      setBook(response.data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(STATUSES.ERROR);
      toast.error("Failed to load book details.");
    }
  }, [_id, auth.token]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const submitReview = async (e) => {
    e.preventDefault();
    const rating = e.target.rating.value;
    const comment = e.target.comment.value;

    if (!rating || !comment) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await createReview(_id, { rating, comment }, "ebook");
      toast.success("Review added successfully.");
      setBook(response.data.book);
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  const renderReviews = useMemo(() => {
    return book?.reviews?.map((review) => (
      <div className="review" key={review._id}>
        <p className="text__primary">{review?.user?.name || auth?.user?.name}</p>
        <p className="date">{formatDate(review.createdAt)}</p>
        <Stars rating={review?.rating} />
        <p>{review?.comment}</p>
      </div>
    ));
  }, [book, auth]);

  if (status === STATUSES.LOADING) {
    return <div>Loading....</div>;
  }

  if (status === STATUSES.ERROR) {
    return <div className="alert alert__danger">Failed to load book details.</div>;
  }

  return (
    <div className="book__detail bg text__color">
      <button
        className="btn btn__secondary"
        style={{ marginBottom: "10px" }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>

      <div className="book__container">
        <div className="image">
          <img
            src={book?.imagePath ? `${BASE_URL}/${book.imagePath}` : image}
            alt="Book cover"
            loading="lazy"
          />
        </div>
        <div className="content">
          <h2>{book?.title}</h2>
          <p>By {book?.author}</p>
          <Stars rating={book?.rating} />
          <p>{book?.totalReviews} Reviews | {book?.rating} out of 5</p>
          <p><span>Category: </span>{book?.category?.name}</p>
          <p><span>Edition: </span>{book?.edition}</p>
          <p><span>Publisher: </span>{book?.publisher}</p>
          <p><span>Description: </span>{book?.description}</p>
          <div className="action">
            <Link
              className="btn btn__secondary"
              to={`/book-reader/${book?.pdfPath}`}
            >
              READ BOOK ONLINE
            </Link>
          </div>
        </div>
      </div>

      <div className="reviews__container">
        <h1>REVIEWS</h1>
        <h4>Write a Review</h4>
        {!isAuth && (
          <span>
            Please log in to review the book.{" "}
            <Link to="/login" className="text__primary">
              Login
            </Link>
          </span>
        )}

        {isAuth && (
          <form onSubmit={submitReview}>
            <div className="form-control">
              <label htmlFor="rating">Rating</label>
              <select
                name="rating"
                id="rating"
                className="bg__accent text__color"
                required
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option value={num} key={num}>
                    {num} - {["Poor", "Fair", "Good", "Very Good", "Excellent"][num - 1]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="comment">Comment</label>
              <textarea
                name="comment"
                id="comment"
                cols="30"
                rows="4"
                className="bg__accent text__color"
                required
              ></textarea>
            </div>
            <div style={{ margin: "20px 0" }}>
              <button type="submit" className="btn btn__secondary">
                SUBMIT
              </button>
            </div>
          </form>
        )}

        {renderReviews}
      </div>
    </div>
  );
};

export default EBookDetail;
