import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.scss';
import defaultBookCover from '../../../assets/cover404.jpg';
import { BASE_URL } from '../../../http';

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const CustomSlider = ({ data = [] }) => {
  const sliderRef = useRef(null);

  // Filter out duplicate books based on unique ID
  const uniqueData = Array.from(new Set(data.map(book => book._id)))
    .map(id => data.find(book => book._id === id));

  return (
    <section className="book__slider">
      <div className="container">
        {/* Previous and next buttons */}
        <button
          onClick={() => sliderRef.current.slickPrev()}
          className="btn__circle btn__prev"
          aria-label="Previous"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className="btn__circle btn__next"
          aria-label="Next"
        >
          <FaArrowRight />
        </button>
        <div className="heading">
          <h1>New Arrivals</h1>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {uniqueData.length > 0 ? uniqueData.map(book => (
            <div key={book._id} className="book__card bg__accent">
              <img
                src={book.imagePath ? `${BASE_URL}/${book.imagePath}` : defaultBookCover}
                alt={book.title || 'Book cover'}
                className="book__image"
              />
              <div className="body">
                <h3>{book.title}</h3>
                <p>By {book.author}</p>
                <div className="action">
                  <Link className="btn btn__primary" to={`/books/${book._id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <p>No books available.</p>
          )}
        </Slider>
      </div>
    </section>
  );
};

export default CustomSlider;
