import React, { useState, useRef, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredReportMarkers } from "./public-maps/clustered-report-markers";
import MapHandler from "./public-maps/map-handler";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Maps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const mapId = import.meta.env.VITE_REACT_APP_MAP_ID;

  const baguioBounds = {
    north: 16.433,
    south: 16.375,
    east: 120.610,
    west: 120.570,
  };

  const [activeMarker, setActiveMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [place, setPlace] = useState(null); // Added state for place
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const initMap = () => {
    if (mapRef.current) {
      mapRef.current.setCenter(initialLocation);
      mapRef.current.setZoom(14);
      mapRef.current.setOptions({
        restriction: {
          latLngBounds: baguioBounds,
          strictBounds: true,
        },
      });
    }
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
    initMap();
  };

  const fetchPredictions = async (input) => {
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input,
        locationBias: {
          center: new google.maps.LatLng(
            (baguioBounds.north + baguioBounds.south) / 2,
            (baguioBounds.east + baguioBounds.west) / 2
          ),
          radius: 5000,
        },
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(predictions);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      fetchPredictions(value);
    } else {
      setPredictions([]);
    }
  };

  const updateMap = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.setCenter({ lat, lng });
    }
  };

  const selectPrediction = (prediction) => {
    const { place_id } = prediction;
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const { lat, lng } = place.geometry.location.toJSON();
        setPlace(place); // Store the selected place
        setSearchTerm(""); // Clear input after selection
        updateMap(lat, lng);
        setPredictions([]);
      }
    });
  };

  useEffect(() => {
    const initAutocomplete = async () => {
      await google.maps.importLibrary("places");
    };
    initAutocomplete();
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full relative">
        <div className="absolute top-3 left-3 z-50 max-w-xs">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for places or addresses..."
              className="autocomplete-input text-sm pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} className="text-gray-500" />
            </div>
          </div>
          {predictions.length > 0 && (
            <ul className="absolute bg-white border rounded-md text-sm max-h-60 overflow-y-auto z-50 mt-1">
              {predictions.map((prediction) => (
                <li
                  key={prediction.place_id}
                  className="flex flex-col gap-0 p-2 cursor-pointer hover:bg-gray-200 border-b"
                  onClick={() => selectPrediction(prediction)}
                >
                  <strong>{prediction.structured_formatting.main_text}</strong>
                  <span className="text-sm">{prediction.structured_formatting.secondary_text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Map
          onLoad={handleMapLoad}
          defaultCenter={initialLocation}
          defaultZoom={14}
          disableDefaultUI={true}
          mapId={mapId}
        >
          <ClusteredReportMarkers
            reports={data}
            onMarkerClick={setActiveMarker}
            activeMarker={activeMarker}
            onCloseInfoWindow={() => setActiveMarker(null)}
          />
          <MapHandler place={place} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default Maps;
