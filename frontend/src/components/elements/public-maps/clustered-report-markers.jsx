import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ReportMarker } from "./report-marker";

export const ClusteredReportMarkers = ({ reports, onMarkerClick, activeMarker, onCloseInfoWindow, isPublicMap }) => {
  const [markers, setMarkers] = useState({});
  const map = useMap();

  const clusterer = useMemo(() => {
    if (!map) return null;
    const clustererInstance = new MarkerClusterer({ map });

    // Handle cluster clicks
    clustererInstance.addListener("clusterclick", (event) => {
      const markersInCluster = event.getMarkers();
      if (markersInCluster.length > 0) {
        const firstMarkerPosition = markersInCluster[0].getPosition();
        map.panTo(firstMarkerPosition); // Smoothly pan to the first marker's position
      }
    });

    return clustererInstance;
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker, key) => {
    setMarkers((prevMarkers) => {
      if ((marker && prevMarkers[key]) || (!marker && !prevMarkers[key])) return prevMarkers;

      if (marker) {
        return { ...prevMarkers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = prevMarkers;
        return newMarkers;
      }
    });
  }, []);

  return (
    <>
      {reports.map((report) => (
        <ReportMarker
          key={report._id}
          report={report}
          onClick={onMarkerClick}
          setMarkerRef={setMarkerRef}
          isActive={activeMarker === report._id}
          onClose={onCloseInfoWindow}
          isPublicMap={isPublicMap}
        />
      ))}
    </>
  );
};
