import React, { useEffect, useState, useRef } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Button } from "../ui/button";
import { toast } from "sonner"; // Import toast from Sonner
import { LocateIcon } from "lucide-react";
const Maps = ({ userInfo }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const [currentLocation, setCurrentLocation] = useState(initialLocation); // Start at Baguio
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key
  const mapRef = useRef(null); // Ref to access the map instance

  // Bounds for the Philippines
  const philippinesBounds = {
    north: 21.335,
    south: 5.749,
    east: 126.604,
    west: 116.695,
  };

  // Function to fetch the current location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };

          // Update the marker position
          setCurrentLocation(newLocation);

          // Recenter the map to the new location
          if (mapRef.current) {
            mapRef.current.setCenter(newLocation);
            mapRef.current.setZoom(16); // Optionally set zoom level
          }

          // Show a warning if the accuracy is not within acceptable limits
          if (accuracy > 100) {
            toast.error(
              `Your location cannot be pinpointed high accuracy. Try searching manually or use a mobile device for better accuracy.`,
              {
                duration: 10000, // Show for 10 seconds
              }
            );
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          toast.error("Failed to retrieve location. Falling back to Baguio.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported.");
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultZoom={16}
          defaultCenter={initialLocation} // Set initial center
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          options={{
            restriction: {
              latLngBounds: philippinesBounds,
              strictBounds: true,
            },
          }}
          ref={mapRef} // Assign ref to the map
        >
          {/* Marker for the current location */}
          <Marker position={currentLocation} />
        </Map>
      </APIProvider>
      <Button size="sm" variant="outline" onClick={fetchLocation} className="text-xs rounded-md flex gap-x-2 absolute top-3 left-3 z-50">
        <LocateIcon size={13}/> Use Current Location
      </Button>
      
    </div>
  );
};

export default Maps;
