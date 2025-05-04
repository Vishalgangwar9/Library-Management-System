import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAtlas, FaBook, FaLayerGroup, FaUser } from 'react-icons/fa';
import { CustomSlider, Loader, Stars } from '../../components';
import { BASE_URL, STATUSES, getHomePageData } from '../../http';
import './home.scss';
import bookImage from '../../assets/book1.jpg';

const Home = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(STATUSES.IDLE);

  const fetchData = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const response = await getHomePageData();
      setData(response.data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    return <div className="text__color">Error while loading data...</div>;
  }

  return (
    <div className="bg text__color">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Shri Ram Murti Smarak College of Engineering and Technology, Bareilly - SRMS Library</h1>
        <p className="subheading">
          Explore our vast collection of books and resources.
        </p>
        <Link to="/books" className="btn btn__secondary">
          Browse Catalog
        </Link>
      </section>

      {/* Welcome Message */}
      <section className="welcome">
        <div className="left">
          <div className="heading">
            <h1>Welcome Message</h1>
          </div>
          <p>
            Welcome to the Shri Ram Murti Smarak College of Engineering and Technology, Bareilly, SRMS Library Management
            System!
          </p>
          <p>
            Our modern, fully automated college library is undoubtedly a state-of-the-art Information Resource Center that
            fulfills the ever-evolving needs of our academic clientele. We are dedicated to supporting the curriculum and
            educational mission of the college. The aim of the SRMS Library is to deliver the best print, digital, and
            online information resources and reference services to support your teaching, learning, and research activities.
            We also provide a conducive environment and wonderful spaces for research, study, and collaboration.
          </p>
        </div>
        <div className="right">
          {/* <img src={principalImage} alt="Principal Image" /> */}
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="popular__books">
        <div className="heading">
          <h1>Popular Books</h1>
        </div>
        <div className="card__wrapper">
          {data?.popularBooks?.map((book) => (
            <div className="card bg__accent" key={book._id}>
              <img
                src={book?.imagePath ? `${BASE_URL}/${book?.imagePath}` : bookImage}
                alt={book.title || 'Book cover'}
              />
              <div className="content">
                <p className="book-title">{book.title}</p>
                <p>By {book.author}</p>
                <div className="stars">
                  <Stars rating={book.rating} />
                </div>
                <p>
                  {book.totalReviews} Reviews | {book.rating} out of 5
                </p>
                <div className="action">
                  <Link className="btn btn__secondary" to={`/books/${book._id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="button">
          <Link to="/books" className="btn btn__primary">
            See All
          </Link>
        </div>
      </section>

      {/* Counter Section */}
      <section className="counter__section">
        <div>
          <FaBook className="icon" />
          <h3>Total Books</h3>
          <p>{data?.totalBooks}</p>
        </div>
        <div>
          <FaAtlas className="icon" />
          <h3>Total EBooks</h3>
          <p>{data?.totalEBooks}</p>
        </div>
        <div>
          <FaUser className="icon" />
          <h3>Total Users</h3>
          <p>{data?.totalUsers}</p>
        </div>
        <div>
          <FaLayerGroup className="icon" />
          <h3>Total Categories</h3>
          <p>{data?.totalCategories}</p>
        </div>
      </section>

      <CustomSlider data={data?.newBooks} />
    </div>
  );
};

export default Home;
