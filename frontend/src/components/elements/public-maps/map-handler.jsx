import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';

const MapHandler = ({ place }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else if (place.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(18); // Adjust zoom level if necessary
    }
  }, [map, place]);

  return null;
};

export default React.memo(MapHandler);
