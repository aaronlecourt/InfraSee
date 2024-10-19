import React, { useState, useRef, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredReportMarkers } from "./clustered-report-markers";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MapHandler from "./map-handler";
import { Search } from "lucide-react"; // Import the Search icon

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 };
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
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [place, setPlace] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);

  const initMap = () => {
    if (mapRef.current) {
      mapRef.current.setCenter(initialLocation);
      mapRef.current.setZoom(18);
      mapRef.current.setOptions({
        restriction: {
          latLngBounds: baguioBounds,
          strictBounds: true,
        },
      });
    }
  };

  const updateMap = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.setCenter({ lat, lng });
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
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

  const selectPrediction = (prediction) => {
    const { place_id } = prediction;
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const { lat, lng } = place.geometry.location.toJSON();
        setPlace(place);
        setSelectedLocation({ lat, lng, address: place.formatted_address });
        updateMap(lat, lng);
        setSearchTerm(""); // Clear the input after selecting the location
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
      <div className="h-[100vh] sm:h-screen w-screen relative">
        <div className="absolute top-20 left-5 z-50 max-w-xs">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for places or addresses..."
              className="autocomplete-input text-sm pl-10" // Add padding to accommodate the icon
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
                  className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-gray-200 border-b"
                  onClick={() => selectPrediction(prediction)}
                >
                  <div>
                    <strong>{prediction.structured_formatting.main_text}</strong>
                    <br />
                    <span className="text-sm">
                      {prediction.structured_formatting.secondary_text}
                    </span>
                  </div>
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

export default PublicMaps;
