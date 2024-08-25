import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#0e0d0e] p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-white mb-6">Unauthorized</h1>
        <p className="text-lg text-gray-300 mb-4">
          You do not have permission to access this page. If you believe this is an error, please contact support.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-white text-[#0e0d0e] font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e0d0e] transition duration-150 ease-in-out"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
