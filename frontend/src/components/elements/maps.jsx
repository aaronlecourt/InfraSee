import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const Maps = ({ userInfo }) => {
  const [center] = useState({ lat: 16.4023, lng: 120.596 });
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key

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

  }, [userInfo]);

  const benguetBounds = {
    north: 16.6023,
    south: 16.1833,
    east: 120.7461,
    west: 120.4822,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={7}
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