import React, { useState, useRef, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredReportMarkers } from "./public-maps/clustered-report-markers";
import MapHandler from "./public-maps/map-handler";
import { Input } from "@/components/ui/input";
import { Search, LayersIcon, LucideEyeOff } from "lucide-react";
import { DatePickerWithRange } from "./public-maps/datepickerwithrange";
import { Button } from "../ui/button";

const statusIcons = {
  Unassigned: "/pins/pins_-04.png",
  "In Progress": "/pins/pins_-02.png",
  Resolved: "/pins/pins_-03.png",
  Pending: "/pins/pins_-01.png",
  Dismissed: "/pins/pins_-05.png",
};

const Maps = ({ data, userInfo }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const mapId = import.meta.env.VITE_REACT_APP_MAP_ID;

  const baguioBounds = {
    north: 16.433,
    south: 16.375,
    east: 120.61,
    west: 120.57,
  };

  const [activeMarker, setActiveMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [place, setPlace] = useState(null);
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [statusVisible, setStatusVisible] = useState(false); // State for status visibility
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleDateRangeChange = (range) => {
    if (range && range.from && range.to) {
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      fromDate.setUTCHours(0, 0, 0, 0);
      toDate.setUTCHours(23, 59, 59, 999);
      const fromISO = fromDate.toISOString();
      const toISO = toDate.toISOString();
      setDateRange({ from: fromISO, to: toISO });
    } else {
      setDateRange({ from: null, to: null });
    }
  };

  const filteredData = data.filter((report) => {
    const reportDate = new Date(report.createdAt);
    const normalizedReportDate = new Date(reportDate.setUTCHours(0, 0, 0, 0));

    const { from, to } = dateRange;

    const fromDate = from ? new Date(from).setUTCHours(0, 0, 0, 0) : null;
    const toDate = to ? new Date(to).setUTCHours(23, 59, 59, 999) : null;

    const isInDateRange =
      (fromDate === null || normalizedReportDate >= fromDate) &&
      (toDate === null || normalizedReportDate <= toDate);

    const isStatusMatch =
      selectedStatus === "All" ||
      report.report_status.stat_name === selectedStatus;

    return isInDateRange && isStatusMatch;
  });

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
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails({ placeId: place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const { lat, lng } = place.geometry.location.toJSON();
        setPlace(place);
        setSearchTerm("");
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
        <div className="absolute top-3 left-3 z-10 max-w-md gap-2 flex flex-col-reverse sm:flex-row">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for places or addresses..."
              className="autocomplete-input text-sm pl-10"
            />
            <div className="absolute z-20 left-3 top-3">
              <Search size={16} className="text-gray-500" />
            </div>
          </div>
          {predictions.length > 0 && (
            <ul className="absolute bg-white border rounded-md text-sm max-h-52 overflow-y-auto z-10 mt-10">
              {predictions.map((prediction) => (
                <li
                  key={prediction.place_id}
                  className="flex flex-col gap-0 p-2 cursor-pointer hover:bg-gray-200 border-b"
                  onClick={() => selectPrediction(prediction)}
                >
                  <strong>{prediction.structured_formatting.main_text}</strong>
                  <span className="text-sm">
                    {prediction.structured_formatting.secondary_text}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <DatePickerWithRange onDateSelect={handleDateRangeChange} />
        </div>

        {!userInfo.isSubModerator && (
          <>
            {/* Toggle button for status */}
            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2 shadow-sm">
              <Button
                variant="outline"
                onClick={() => setStatusVisible(!statusVisible)}
                className="p-0 w-10 h-10 rounded-full border"
              >
                {!statusVisible ? (
                  <LayersIcon size={16} />
                ) : (
                  <LucideEyeOff size={16} />
                )}
              </Button>

              {statusVisible && (
                <div className="flex gap-2 flex-col items-end">
                  {[
                    "All",
                    "Pending",
                    "Resolved",
                    "In Progress",
                    "Dismissed",
                    "Unassigned",
                  ].map((status) => (
                    <Button
                      key={status}
                      className="h-10 flex items-center gap-x-2 sm:w-auto sm:p-3 p-auto rounded-md text-sm"
                      variant={
                        selectedStatus === status ? "default" : "outline"
                      }
                      onClick={() => handleStatusChange(status)}
                    >
                      {status !== "All" && (
                        <>
                          <img
                            src={statusIcons[status]}
                            alt={status}
                            className="h-4"
                          />
                          <span className="sm:block hidden">{status}</span>
                        </>
                      )}
                      {status === "All" && <span>{status}</span>}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <Map
          onLoad={handleMapLoad}
          defaultCenter={initialLocation}
          defaultZoom={14}
          disableDefaultUI={true}
          mapId={mapId}
        >
          <ClusteredReportMarkers
            reports={filteredData}
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
