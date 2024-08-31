// src/screens/not-found-page.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Unlink } from 'lucide-react'; // Import icons
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "InfraSee - Error";
  });

  const handleGoBack = () => {
    // Determine if we should go back or navigate to the home page
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat">
      <div className=" p-8 rounded-lg text-center max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <Unlink strokeWidth={3} className="mr-2" />
          <h1 className="text-3xl font-extrabold">404 - Page Not Found</h1>
        </div>
        <p className="text-base text-gray-500 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="font-semibold"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <Button

            onClick={() => navigate('/')}
            className="font-semibold"
          >
            <Home size={16} className="mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
