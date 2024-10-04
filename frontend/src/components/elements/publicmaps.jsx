import React, { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LocateFixed } from "lucide-react";

const PublicMaps = ({ data }) => {
  const initialLocation = { lat: 16.4023, lng: 120.596 }; // Baguio City
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY";

  // Bounds for Benguet
  const benguetBounds = {
    north: 16.569,
    south: 16.25,
    east: 120.778,
    west: 120.396,
  };

  const [activeMarker, setActiveMarker] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const handleMapClick = (event) => {
    // Close InfoWindow if it's open
    if (activeMarker) {
      setActiveMarker(null);
    }

    // Check if event.latLng is available
    if (event && event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Reverse geocode the clicked location
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setSearchTerm(results[0].formatted_address); // Set the input field with the address
          setSelectedLocation({ lat, lng, address: results[0].formatted_address });
          if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(20); // Zoom in on the selected location
          }
        } else {
          console.error("Geocoder failed due to: " + status);
        }
      });
    } else {
      console.error("LatLng is undefined.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const initAutocomplete = async () => {
    const [{ Autocomplete }] = await Promise.all([
      google.maps.importLibrary("places"),
    ]);

    const autocomplete = new Autocomplete(inputRef.current);
    autocomplete.setFields(["place_id", "geometry", "formatted_address"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const location = place.geometry.location;

        // Set the selected location with full address
        setSelectedLocation({
          lat: location.lat(),
          lng: location.lng(),
          address: place.formatted_address, // Store full address
        });

        // Update search term to show the selected address
        setSearchTerm(place.formatted_address);
      } else {
        console.warn("Place geometry is not available. Place details:", place);
      }
    });

    inputRef.current.addEventListener("input", (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (value) {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: "ph" },
            locationBias: {
              center: {
                lat: (benguetBounds.north + benguetBounds.south) / 2,
                lng: (benguetBounds.east + benguetBounds.west) / 2,
              },
              radius:
                Math.sqrt(
                  Math.pow(benguetBounds.north - benguetBounds.south, 2) +
                    Math.pow(benguetBounds.east - benguetBounds.west, 2)
                ) * 1000,
            },
          },
          (predictions) => {
            if (predictions) {
              const filteredPredictions = predictions.filter((prediction) => {
                const { geometry } = prediction;
                if (geometry && geometry.location) {
                  const lat = geometry.location.lat();
                  const lng = geometry.location.lng();
                  return (
                    lat >= benguetBounds.south &&
                    lat <= benguetBounds.north &&
                    lng >= benguetBounds.west &&
                    lng <= benguetBounds.east
                  );
                }
                return false;
              });
              setAutocompleteResults(filteredPredictions);
            } else {
              setAutocompleteResults([]);
            }
          }
        );
      } else {
        setAutocompleteResults([]);
        setSelectedLocation(null); // Clear the selected location if input is empty
      }
    });
  };

  useEffect(() => {
    initAutocomplete();
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-[100vh] sm:h-screen w-screen relative">
        <div className="absolute top-20 left-5 z-50 bg-white p-3 rounded-lg border max-w-xs">
          <p className="text-base font-bold">Set Report Location</p>
          <p className="text-xs text-muted-foreground font-medium leading-4 mb-4">
            Manually click points on the map or use your current location automatically.
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
                  setSelectedLocation(null); // Clear the selected location
                }
              }}
              placeholder="Search for places or addresses..."
              className="autocomplete-input text-sm w-full"
            />
            <Button variant="outline">
              <LocateFixed size={15} />
            </Button>
          </div>
        </div>

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
                onClick={() => setActiveMarker(report._id)}
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
                        <p className="border-t mt-2 pt-2"><strong>Reported on:</strong> {formatDate(report.createdAt)}</p>
                      </div>

                      <div className="mt-3">
                        <img
                          src={report.report_img}
                          alt={report.report_desc}
                          style={{ width: "100%", marginTop: 0 }}
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

          {/* Marker for the selected location */}
          {selectedLocation && (
            <Marker
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
            />
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default PublicMaps;
