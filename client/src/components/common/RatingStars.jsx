import React, { useState, useEffect } from 'react';
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";

function RatingStars({ Review_Count, Star_Size }) {
  const [starCount, setStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0
  });

  useEffect(() => {
    const wholeStars = Math.floor(Review_Count) || 0;
    const halfStars = (Review_Count % 1 >= 0.5) ? 1 : 0; // Check if there's a half star
    const emptyStars = 5 - (wholeStars + halfStars); // Total stars minus full and half stars

    setStarCount({
      full: wholeStars,
      half: halfStars,
      empty: emptyStars
    });
  }, [Review_Count]); // Only add Review_Count as a dependency

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...new Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline key={`full-${i}`} size={Star_Size || 20} />
      ))}
      {[...new Array(starCount.half)].map((_, i) => (
        <TiStarHalfOutline key={`half-${i}`} size={Star_Size || 20} />
      ))}
      {[...new Array(starCount.empty)].map((_, i) => (
        <TiStarOutline key={`empty-${i}`} size={Star_Size || 20} />
      ))}
    </div>
  );
}

export default RatingStars;
