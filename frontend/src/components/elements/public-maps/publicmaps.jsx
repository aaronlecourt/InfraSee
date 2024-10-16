import React, { useState, useRef } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { ReportMarker } from "./report-marker";

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"
  const mapId = "dc7acc717d908011"

  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Store marker references

  const handleMarkerClick = (reportId) => {
    setActiveMarker(reportId);
  };

  const setMarkerRef = (marker, key) => {
    markersRef.current[key] = marker;
  };

  const handleCloseInfoWindow = () => {
    setActiveMarker(null);
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[100vh] sm:h-screen w-screen relative">
        <Map
          onLoad={(map) => (mapRef.current = map)}
          defaultZoom={14}
          defaultCenter={initialLocation}
          disableDefaultUI={true}
          mapId={mapId}
        >
          {data.map((report) => (
            <ReportMarker
              key={report._id}
              report={report}
              onClick={handleMarkerClick}
              setMarkerRef={setMarkerRef}
              isActive={activeMarker === report._id}
              onClose={handleCloseInfoWindow}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default PublicMaps;
