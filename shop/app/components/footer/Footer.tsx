import React, { useEffect, useState } from 'react'

const Footer = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down more than 100 pixels
      setHasScrolled(window.scrollY > 100);
    };
    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll to the top when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <footer className="bg-gray-800 text-white text-center py-6">
         <button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full transition-opacity duration-300 ${hasScrolled ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-up-circle"
            viewBox="0 0 16 16"
          >
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
          </svg>
        </button>
      <div className="container mx-auto">
        <p>&copy; 2024 Crazy Shopping. All rights reserved @Rachad Bouhjar.</p>
      </div>
    </footer>
  )
}

export default Footer