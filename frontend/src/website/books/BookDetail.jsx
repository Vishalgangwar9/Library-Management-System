import React, { useEffect, useState } from "react";
import image from "../../assets/cover404.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BASE_URL,
  STATUSES,
  createReview,
  getBook,
  reservedBook,
} from "../../http";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import Stars from "../../components/website/stars/Stars";

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const { _id } = useParams();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitReview = (e) => {
    e.preventDefault();
    const promise = createReview(_id, {
      rating: e.target.rating.value,
      comment: e.target.comment.value,
    });
    toast.promise(promise, {
      loading: "Adding...",
      success: (response) => {
        e.target.rating.value = "";
        e.target.comment.value = "";
        setBook(response?.data?.book);
        return "Review added successfully..";
      },
      error: (err) => err?.response?.data?.message || "Something went wrong !",
    });
  };

  const handleReservedBook = () => {
    const promise = reservedBook({
      ISBN: book?.ISBN,
    });
    toast.promise(promise, {
      loading: "Reserving...",
      success: (response) => {
        setBook(response?.data?.book);
        return "Reserved successfully..";
      },
      error: (err) => err?.response?.data?.message || "Something went wrong !",
    });
  };

  const fetchBook = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getBook(_id);
      setBook(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      setStatus(STATUSES.ERROR);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [_id]);

  if (status === STATUSES.LOADING) {
    return <div>Loading....</div>;
  }

  if (status === STATUSES.ERROR) {
    return <div className="alert alert__danger">Something went wrong</div>;
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
            src={book?.imagePath ? `${BASE_URL}/${book?.imagePath}` : image}
            alt="book"
          />
        </div>
        <div className="content">
          <h2>{book?.title}</h2>
          <p>ISBN is {book?.ISBN}</p>
          <p>By {book?.author}</p>
          <p>
            <Stars rating={book?.rating} />
          </p>
          <p>
            {book?.totalReviews} Reviews | {book?.rating} out of 5
          </p>
          <p style={{ display: "flex", columnGap: "5px" }}>
            <span>Status: </span>{" "}
            <span
              className={`badge ${
                book?.status === "Available"
                  ? "badge__success"
                  : book?.status === "Issued"
                  ? "badge__danger"
                  : book?.status === "Reserved"
                  ? "badge__warning"
                  : "badge__info"
              }`}
            >
              {book?.status}
            </span>
          </p>
          <p>
            <span>Category: </span>
            {book?.category?.name}
          </p>
          <p>
            <span>Almirah:</span> {book?.almirah?.number} (
            {book?.almirah?.subject})
          </p>
          <p>
            <span>Edition: </span>
            {book?.edition}
          </p>
          <p>
            <span>Publisher: </span>
            {book?.publisher}
          </p>
          <p>
            <span>Description:</span>
            {book?.description}
          </p>

          <div className="action">
            {book?.status === "Available" ? (
              auth?.isAuth ? (
                <div>
                  <button
                    className="btn btn__primary"
                    onClick={handleReservedBook}
                  >
                    Reserve Now
                  </button>
                </div>
              ) : (
                <Link className="btn btn__primary" to="/login">
                  Login to Reserve
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
      <div className="reviews">
        <h3>Reviews</h3>
        <ul>
          {book?.reviews?.length ? (
            book?.reviews?.map((review) => (
              <li className="review" key={review?._id}>
                <p>
                  <span>{review?.user?.firstName}</span>
                  <Stars rating={review?.rating} />
                </p>
                <p>{review?.comment}</p>
                <p>{formatDate(review?.createdAt)}</p>
              </li>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </ul>
        {auth?.isAuth ? (
          <form onSubmit={submitReview}>
            <div className="input__box">
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                placeholder="Rating"
                required
              />
            </div>
            <div className="input__box">
              <textarea
                name="comment"
                rows="5"
                placeholder="Write your review"
                required
              ></textarea>
            </div>
            <div className="input__box">
              <button type="submit" className="btn btn__primary">
                Submit Review
              </button>
            </div>
          </form>
        ) : (
          <Link className="btn btn__primary" to="/login">
            Login to write a review
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
