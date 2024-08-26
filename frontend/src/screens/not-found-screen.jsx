import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#0e0d0e] p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-white mb-6">404 - Page Not Found</h1>
        <p className="text-lg text-gray-300 mb-4">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate(-1)}  // This navigates the user back to the previous page
          className="inline-block px-6 py-3 bg-white text-[#0e0d0e] font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e0d0e] transition duration-150 ease-in-out"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}  // This navigates the user to the home page
          className="inline-block px-6 py-3 bg-white text-[#0e0d0e] font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e0d0e] transition duration-150 ease-in-out ml-4"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
