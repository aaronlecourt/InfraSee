import React, { useEffect, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const Maps = () => {
  const [center, setCenter] = useState({ lat: 16.4023, lng: 120.596 }); // Default to Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY";

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting location: ", error);
            // Fall back to Baguio City on error
            setCenter({ lat: 16.4023, lng: 120.596 });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 } // Options for high accuracy
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchLocation();
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center} // Use the state variable for center
        defaultZoom={15} // Set the zoom level as needed
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />
    </APIProvider>
  );
};

export default Maps;
