import React, { useState, useRef } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key

  // Bounds for Benguet
  const benguetBounds = {
    north: 16.569,
    south: 16.250,
    east: 120.778,
    west: 120.396,
  };

  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  const handleMapClick = () => {
    setActiveMarker(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="h-[150vh] sm:h-screen w-screen">
      <APIProvider apiKey={apiKey}>
        <Map
          ref={mapRef}
          defaultZoom={14}
          defaultCenter={initialLocation}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          options={{
            restriction: {
              latLngBounds: benguetBounds,
              strictBounds: true,
            },
          }}
          onClick={handleMapClick}
        >
          {data.map((report) => {
            const reportLocation = {
              lat: parseFloat(report.latitude),
              lng: parseFloat(report.longitude),
            };

            return (
              <Marker
                key={report._id}
                position={reportLocation}
                onClick={() => setActiveMarker(report._id)} // Set active marker on click
              />
            );
          })}

          {data.map((report) => {
            const reportLocation = {
              lat: parseFloat(report.latitude),
              lng: parseFloat(report.longitude),
            };

            return (
              activeMarker === report._id && (
                <InfoWindow
                  headerDisabled={true}
                  key={report._id} // Ensure unique key for InfoWindow
                  position={reportLocation}
                  options={{
                    maxWidth: 300, // Set max width
                    disableAutoPan: false, // Allow auto panning
                  }}
                  onCloseClick={() => setActiveMarker(null)} // Close info window
                >
                  <div className="m-0 p-0">
                    <div className="w-full">
                      <div className="text-base leading-none font-bold mb-1">
                        {report.report_desc}
                        <br />
                      </div>
                      <div className="flex justify-between items-center">
                        <p>{report.report_by}</p>
                        {report.account_num ? (
                          <span>{report.account_num}</span>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      <p className="border-t mt-2 pt-2 font-medium">{formatDate(report.createdAt)}</p>
                    </div>

                    <div className="mt-3 flex flex-col gap-y-2">
                      <img
                        src={report.report_img}
                        alt={report.report_desc}
                        style={{ maxHeight: "200px", width: "100%", marginTop: 0 }}
                        className="rounded-md border"
                      />
                      <p>{report.report_address}</p>
                    </div>

                    <div className="flex items-center mt-3 justify-between">
                      <div className="font-bold">{report.report_mod.name}</div>
                      <div className="px-2 font-medium text-xs rounded-sm py-1 bg-black text-white">
                        {report.report_status.stat_name}
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
};

export default PublicMaps;
