import React, { useState, useRef, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredReportMarkers } from "./clustered-report-markers";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key
  const mapId = "dc7acc717d908011"; // Your Map ID

  const baguioBounds = {
    north: 16.433,
    south: 16.375,
    east: 120.610,
    west: 120.570,
  };

  const [activeMarker, setActiveMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const initAutocomplete = async () => {
    const [{ Autocomplete }] = await Promise.all([google.maps.importLibrary("places")]);
    const autocomplete = new Autocomplete(inputRef.current);
    autocomplete.setFields(["place_id", "geometry", "name", "formatted_address"]);
    autocomplete.setBounds(new google.maps.LatLngBounds(
      new google.maps.LatLng(baguioBounds.south, baguioBounds.west),
      new google.maps.LatLng(baguioBounds.north, baguioBounds.east)
    ));
    autocomplete.setOptions({ strictBounds: true });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location.toJSON();
        if (
          lat >= baguioBounds.south &&
          lat <= baguioBounds.north &&
          lng >= baguioBounds.west &&
          lng <= baguioBounds.east
        ) {
          setSelectedLocation({ lat, lng, address: place.formatted_address });
          setSearchTerm(place.name);
          setActiveMarker("selected");
          adjustMap(lat, lng);
        } else {
          toast.error("Please select a location within Baguio.");
        }
      }
    });
  };

  const adjustMap = (lat, lng) => {
    console.log(`Panning to location: lat=${lat}, lng=${lng}`); // Log the latitude and longitude
    if (mapRef.current) {
      console.log("Map reference is valid.");
      mapRef.current.setCenter({ lat, lng });
      mapRef.current.setZoom(17); // Set a fixed zoom level for clarity
    } else {
      console.error("Map reference is null:", mapRef.current);
    }
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
    console.log("Map loaded:", map);
  };

  useEffect(() => {
    initAutocomplete();
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[100vh] sm:h-screen w-screen relative">
        <div className="absolute top-20 left-5 z-50 max-w-xs">
          <div className="flex gap-x-2">
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (!value) {
                  setSelectedLocation(null);
                  setActiveMarker(null);
                }
              }}
              placeholder="Search for places or addresses..."
              className="autocomplete-input text-sm w-full"
            />
          </div>
        </div>
        <Map
          onLoad={handleMapLoad} // Use the separate function for handling map load
          defaultCenter={initialLocation}
          defaultZoom={14}
          disableDefaultUI={true}
          mapId={mapId}
          onClick={(e) => {
            const latLng = e.latLng.toJSON();
            adjustMap(latLng.lat, latLng.lng); // Adjust map to clicked location if needed
          }}
        >
          <ClusteredReportMarkers
            reports={data}
            onMarkerClick={setActiveMarker}
            activeMarker={activeMarker}
            onCloseInfoWindow={() => setActiveMarker(null)}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default PublicMaps;
