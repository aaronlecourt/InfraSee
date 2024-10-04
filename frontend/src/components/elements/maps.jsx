import React, { useEffect, useState, useRef } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "../ui/button";
import { LocateIcon } from "lucide-react";

const Maps = ({ userInfo, data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key
  const mapRef = useRef(null);
  const [activeMarkerId, setActiveMarkerId] = useState(null); // Store the ID of the active marker

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMapClick = () => {
    // Close InfoWindow if it's open
    if (activeMarkerId) {
      setActiveMarkerId(null);
    }
  };

  const benguetBounds = {
    north: 16.569,
    south: 16.25,
    east: 120.778,
    west: 120.396,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ position: "relative", height: "100%" }}>
        <Map
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
          onClick={handleMapClick} // Handle map clicks
          ref={mapRef}
        >
          {data.map((item) => (
            <Marker
              key={item._id}
              position={{
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
              }}
              onClick={() => setActiveMarkerId(item._id)} // Set active marker ID
            />
          ))}

          {activeMarkerId && data.map((item) => {
            if (activeMarkerId === item._id) {
              const markerPosition = {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
              };

              return (
                <InfoWindow
                  headerDisabled={true}
                  key={item._id}
                  position={markerPosition}
                  options={{
                    maxWidth: 300,
                    disableAutoPan: false,
                  }}
                  onCloseClick={() => setActiveMarkerId(null)} // Close info window
                >
                  <div className="m-0 p-0">
                    <div className="w-full">
                      <div className="text-base leading-none font-bold mb-1">
                        {item.report_desc}
                        <br />
                      </div>
                      <div className="flex justify-between items-center">
                        <p>{item.report_by}</p>
                        {item.account_num ? (
                          <span>{item.account_num}</span>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      <p className="border-t mt-2 pt-2">
                        <strong>Reported on:</strong> {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="mt-3">
                      <img
                        src={item.report_img}
                        alt={item.report_desc}
                        style={{ width: "100%", marginTop: 0 }}
                        className="rounded-md border"
                      />
                      <p>{item.report_address}</p>
                    </div>

                    <div className="flex items-center mt-3 justify-between">
                      <div className="font-bold">{item.report_mod?.name}</div>
                      <div className="px-2 font-medium text-xs rounded-sm py-1 bg-black text-white">
                        {item.report_status?.stat_name}
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              );
            }
            return null; // Return null if it’s not the active marker
          })}
        </Map>
      </div>
    </APIProvider>
  );
};

export default Maps;
