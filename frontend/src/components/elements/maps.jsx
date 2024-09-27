import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

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
            // Fallback to Baguio City on error
            setCenter({ lat: 16.4023, lng: 120.596 });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchLocation();
  }, []);

  const benguetBounds = {
    north: 16.6023, // Northernmost latitude of Benguet
    south: 16.1833, // Southernmost latitude of Benguet
    east: 120.7461, // Easternmost longitude of Benguet
    west: 120.4822, // Westernmost longitude of Benguet
  };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        options={{
          restriction: {
            latLngBounds: benguetBounds,
            strictBounds: true,
          },
        }}
      >
        <Marker position={center} />
      </Map>
    </APIProvider>
  );
};

export default Maps;
