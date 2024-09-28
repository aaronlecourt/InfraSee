import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import axios from 'axios';

const Maps = () => {
  const [center] = useState({ lat: 16.4023, lng: 120.596 });
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const apiKey = "AIzaSyCq5N2BhjPRx_qLLIwmm6YMftl4oEab9vY"; // Replace with your actual API key

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/reports');
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, []);

  const benguetBounds = {
    north: 16.6023,
    south: 16.1833,
    east: 120.7461,
    west: 120.4822,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-svh sm:h-full"> {/* Mobile height and desktop height */}
        <Map
          defaultCenter={center}
          defaultZoom={13}
          style={{ width: '100%', height: '100%' }} // Use 100% height and width
          gestureHandling={'greedy'}
          options={{
            restriction: {
              latLngBounds: benguetBounds,
              strictBounds: true,
            },
          }}
        >
          {reports.map(report => (
            <Marker
              key={report._id}
              position={{ lat: parseFloat(report.latitude), lng: parseFloat(report.longitude) }}
              onClick={() => setSelectedReport(report)}
            />
          ))}

          {selectedReport && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedReport.latitude),
                lng: parseFloat(selectedReport.longitude),
              }}
              onCloseClick={() => setSelectedReport(null)}
            >
              <div>
                <h3>{selectedReport.report_mod.name}</h3>
                <p>{selectedReport.report_desc}</p>
                <p><strong>Reported by:</strong> {selectedReport.report_by}</p>
                <p><strong>Status:</strong> {selectedReport.report_status.stat_name}</p>
                <p>{selectedReport.report_address}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default Maps;
