"use client";
import React, { useState, useEffect } from 'react';

import logo1 from '../public/logo1.png';
import logo2 from '../public/logo2.png';

const LogoDisplay = () => {
  const [currentLogo, setCurrentLogo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const logos = [
    {
      src: logo2.src,
      alt: 'Anti-Fascist Book Club UK',
      title: 'Anti-Fascist Book Club UK',
    },
    {
      src: logo1.src,
      alt: 'Resistance Symbol',
      title: 'Resistance Through Knowledge',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentLogo((prev) => (prev + 1) % logos.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div className="logo-container">
      <div className="logo-wrapper">
        <img
          key={currentLogo}
          src={logos[currentLogo].src}
          alt={logos[currentLogo].alt}
          className={`logo ${isTransitioning ? 'fade-out' : 'fade-in'}`}
        />
      </div>
      <div className="logo-title">{logos[currentLogo].title}</div>
    </div>
  );
};

export default LogoDisplay;
