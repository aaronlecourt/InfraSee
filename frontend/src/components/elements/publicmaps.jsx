import React, { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LocateFixed } from "lucide-react";
import { toast } from "sonner";

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key
  const mapId = "dc7acc717d908011"; // Your Map ID

  const benguetBounds = {
    north: 16.569,
    south: 16.25,
    east: 120.778,
    west: 120.396,
  };

  const [activeMarker, setActiveMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMapClick = async (event) => {
    if (event?.latLng) {
      const { lat, lng } = event.latLng.toJSON();
      const address = await reverseGeocode(lat, lng);
      setSelectedLocation({ lat, lng, address });
      setActiveMarker("selected"); // Open InfoWindow
      adjustMap(lat, lng); // Center the map
    }
  };

  const reverseGeocode = (lat, lng) => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject("Geocoder failed: " + status);
        }
      });
    });
  };

  const adjustMap = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.setCenter({ lat, lng });
      mapRef.current.setZoom(20); // Zoom level can be adjusted as needed
    }
  };

  const initAutocomplete = async () => {
    const [{ Autocomplete }] = await Promise.all([
      google.maps.importLibrary("places"),
    ]);
    const autocomplete = new Autocomplete(inputRef.current);
    autocomplete.setFields(["place_id", "geometry", "name", "formatted_address"]);
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(benguetBounds.south, benguetBounds.west),
      new google.maps.LatLng(benguetBounds.north, benguetBounds.east)
    );
    autocomplete.setBounds(bounds);
    autocomplete.setOptions({ strictBounds: true });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location.toJSON();
        if (
          lat >= benguetBounds.south &&
          lat <= benguetBounds.north &&
          lng >= benguetBounds.west &&
          lng <= benguetBounds.east
        ) {
          setSelectedLocation({ lat, lng, address: place.formatted_address });
          setSearchTerm(place.name);
          setActiveMarker("selected");
          adjustMap(lat, lng);
        } else {
          toast.error("Please select a location within Benguet.");
        }
      }
    });
  };

  const onMapLoad = (map) => {
    mapRef.current = map; // Store the map instance in the ref
  };

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
  
          // Log latitude, longitude, and accuracy
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          console.log("Accuracy:", accuracy);
  
          if (accuracy > 100) {
            toast.error("Location accuracy is too low. Manually search location or use a mobile device instead.");
          } else {
            setSelectedLocation({ lat: latitude, lng: longitude, address: "Current Location" });
            setActiveMarker("selected");
            adjustMap(latitude, longitude);
          }
        },
        (error) => {
          toast.error("Unable to retrieve your location. Please check your device settings.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };
  

  useEffect(() => {
    initAutocomplete();
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[100vh] sm:h-screen w-screen relative">
        <div className="absolute hidden top-20 left-5 z-50 bg-white p-3 rounded-lg border max-w-xs">
          <p className="text-base font-bold">Set Report Location</p>
          <p className="text-xs text-muted-foreground font-medium leading-4 mb-4">
            Search for nearby landmarks or use your current location.
          </p>
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
                  setActiveMarker(null); // Close InfoWindow when search is cleared
                } else {
                  setActiveMarker(null); // Close InfoWindow when new search is made
                }
              }}
              placeholder="Search for places or addresses..."
              className="autocomplete-input text-sm w-full"
            />
            <Button variant="outline" onClick={handleCurrentLocationClick}>
              <LocateFixed size={15} />
            </Button>
          </div>
        </div>

        <Map
          onLoad={onMapLoad}
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
          mapId={mapId} // Use your Map ID here
          onClick={handleMapClick}
        >
          {data.map((report) => {
            const reportLocation = {
              lat: parseFloat(report.latitude),
              lng: parseFloat(report.longitude),
            };

            return (
              <AdvancedMarker
                key={report._id}
                position={reportLocation}
                anchorPoint={AdvancedMarkerAnchorPoint.TOP_LEFT}
                onClick={() => {
                  setActiveMarker(report._id);
                  adjustMap(reportLocation.lat, reportLocation.lng); // Center on marker
                }}
              />
            );
          })}

          {activeMarker &&
            data.map((report) => {
              const reportLocation = {
                lat: parseFloat(report.latitude),
                lng: parseFloat(report.longitude),
              };

              return (
                activeMarker === report._id && (
                  <InfoWindow
                    headerDisabled={true}
                    key={report._id}
                    position={reportLocation}
                    options={{
                      maxWidth: 300,
                      disableAutoPan: false,
                    }}
                    onCloseClick={() => setActiveMarker(null)}
                  >
                    <div className="m-0 p-0">
                      <div className="w-full">
                        <div className="text-base leading-none font-bold mb-1">
                          {report.report_desc}
                        </div>
                        <div className="flex justify-between items-center">
                          <p>{report.report_by}</p>
                          <span>{report.account_num || "-"}</span>
                        </div>
                        <p className="border-t mt-2 pt-2">
                          <strong>Reported on:</strong>{" "}
                          {formatDate(report.createdAt)}
                        </p>
                      </div>
                      <div className="mt-3">
                        <img
                          src={report.report_img}
                          alt={report.report_desc}
                          className="rounded-md border w-full"
                        />
                        <p>{report.report_address}</p>
                      </div>
                      <div className="flex items-center mt-3 justify-between">
                        <div className="font-bold">
                          {report.report_mod.name}
                        </div>
                        <div className="px-2 font-medium text-xs rounded-sm py-1 bg-black text-white">
                          {report.report_status.stat_name}
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )
              );
            })}
          {selectedLocation && activeMarker === "selected" && (
            <>
              <AdvancedMarker
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                anchorPoint={AdvancedMarkerAnchorPoint.TOP_LEFT}
                onClick={() => {
                  setActiveMarker("selected");
                }}
              />
              <InfoWindow
                headerDisabled={true}
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                options={{ maxWidth: 300 }}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div>
                  <h3 className="text-base font-bold leading-tight">
                    {searchTerm}
                  </h3>
                  <p>{selectedLocation.address}</p>
                  <br />
                  <hr />
                  <br />
                  <p>Latitude: {selectedLocation.lat}</p>
                  <p>Longitude: {selectedLocation.lng}</p>
                </div>
              </InfoWindow>
            </>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default PublicMaps;


