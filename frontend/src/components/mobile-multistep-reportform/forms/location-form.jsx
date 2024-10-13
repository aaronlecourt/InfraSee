import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

const LocationForm = ({ sethasSetLocation, locationData, setLocationData }) => {
  const { address, latitude, longitude } = locationData;
  const [predictions, setPredictions] = useState([]);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const baguioBounds = {
    north: 16.4450,  // Northern bound adjusted to avoid La Trinidad
    south: 16.3250,  // Southern bound
    east: 120.6340,  // Eastern bound
    west: 120.4650,  // Western bound
  };

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      updateMap(latitude, longitude);
    }
  }, [latitude, longitude]);

  // Set the input value to the stored address when the component mounts or updates
  useEffect(() => {
    if (address) {
      inputRef.current.value = address;
    }
  }, [address]);

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (accuracy > 100) {
            toast.error("Location accuracy is too low. Please check your device settings.");
          } else {
            try {
              const fullAddress = await reverseGeocode(latitude, longitude);
              setLocationData({ address: fullAddress, latitude, longitude });
              sethasSetLocation(true);
            } catch (error) {
              console.error("Reverse geocoding failed:", error);
              toast.error("Failed to get address for your location.");
            }
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to retrieve your location. Please check your device settings.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const reverseGeocode = (lat, lng) => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error("Geocoder failed:", status);
          reject("Geocoder failed: " + status);
        }
      });
    });
  };

  const fetchPredictions = async (input) => {
    const service = new google.maps.places.AutocompleteService();

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(baguioBounds.south, baguioBounds.west),
      new google.maps.LatLng(baguioBounds.north, baguioBounds.east)
    );

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
          console.error("Error fetching predictions:", status);
          setPredictions([]);
        }
      }
    );
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value) {
      fetchPredictions(value);
    } else {
      clearLocation();
      setPredictions([]);
    }
  };

  const selectPrediction = (prediction) => {
    const { place_id } = prediction;
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const { lat, lng } = place.geometry.location.toJSON();
        const fullAddress = place.formatted_address;
        const placeName = place.name;

        if (
          lat < baguioBounds.south ||
          lat > baguioBounds.north ||
          lng < baguioBounds.west ||
          lng > baguioBounds.east
        ) {
          toast.error("The selected location is outside of Baguio.");
          return;
        }

        const combinedAddress = `${placeName}, ${fullAddress}`;

        setLocationData({
          address: combinedAddress,
          latitude: lat,
          longitude: lng,
        });
        updateMap(lat, lng);
        sethasSetLocation(true);
        setPredictions([]);
      }
    });
  };

  const initMap = () => {
    const initialLocation = { lat: 16.4023, lng: 120.596 };
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 18,
      disableDefaultUI: true,
      restriction: {
        latLngBounds: baguioBounds,
        strictBounds: true,
      },
    });

    mapInstance.current.addListener("click", (event) => {
      const { lat, lng } = event.latLng.toJSON();
      reverseGeocode(lat, lng)
        .then((fullAddress) => {
          if (
            lat < baguioBounds.south ||
            lat > baguioBounds.north ||
            lng < baguioBounds.west ||
            lng > baguioBounds.east
          ) {
            toast.error("The selected location is outside of Baguio.");
            return;
          }

          setLocationData({ address: fullAddress, latitude: lat, longitude: lng });
          updateMap(lat, lng);
          sethasSetLocation(true);
        })
        .catch((error) => {
          console.error("Failed to reverse geocode:", error);
          toast.error("Failed to get address for the selected location.");
        });
    });
  };

  const updateMap = (lat, lng) => {
    if (mapInstance.current) {
      mapInstance.current.setCenter({ lat, lng });
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: address,
      });
    }
  };

  const clearLocation = () => {
    setLocationData({ address: "Current Location", latitude: null, longitude: null });
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
  };

  return (
    <div className="relative h-[350px] sm:h-[400px]">
      <div ref={mapRef} className="absolute inset-0" />
      <div className="relative z-10 p-4 flex flex-col">
        <div className="flex mb-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for places..."
            className="border p-2 rounded-md w-full mr-2"
            onChange={handleInputChange}
          />
          <Button
            onClick={handleCurrentLocationClick}
            variant="outline"
            className="flex gap-x-2"
          >
            <LocateFixed size={15} />
            <div className="hidden sm:block">Use Current Location</div>
          </Button>
        </div>

        {/* Predictions dropdown */}
        {predictions.length > 0 && (
          <ul className="absolute bg-white border rounded-md text-sm max-h-60 overflow-y-auto z-50 mt-12">
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-gray-200 border-b"
                onClick={() => selectPrediction(prediction)}
              >
                <MapPin size={12} className="text-muted-foreground" />
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

      {/* Div to show lat, lng, and address */}
      {locationData.latitude && locationData.longitude && (
        <div className="absolute bottom-4 left-4 right-4 p-2 bg-white border rounded-md shadow-md text-xs font-normal max-w-xs">
          <div>
            <strong>Latitude: </strong>
            {locationData.latitude}
          </div>
          <div>
            <strong>Longitude: </strong>
            {locationData.longitude}
          </div>
          <div>
            <strong>Address: </strong>
            {locationData.address}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationForm;
