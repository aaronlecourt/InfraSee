import React, { useState, useRef } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredReportMarkers } from "./clustered-report-markers";

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY";
  const mapId = "dc7acc717d908011";

  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  const handleMarkerClick = (reportId) => {
    setActiveMarker(reportId);
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
          <ClusteredReportMarkers
            reports={data}
            onMarkerClick={handleMarkerClick}
            activeMarker={activeMarker}
            onCloseInfoWindow={handleCloseInfoWindow}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default PublicMaps;
