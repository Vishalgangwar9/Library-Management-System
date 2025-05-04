import React from 'react';
import { FaStarHalfAlt, FaStar, FaRegStar } from 'react-icons/fa';

function Stars({ rating }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const number = i + 0.5;
    return (
      <span key={i} className="star">
        {rating >= i + 1 ? (
          <FaStar />
        ) : rating >= number ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
    );
  });

  return <div style={{ margin: '10px 0' }}>{stars}</div>;
}

export default Stars;
