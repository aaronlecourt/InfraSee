import React, { useCallback, useState } from "react";
import { AdvancedMarker, AdvancedMarkerAnchorPoint, InfoWindow } from "@vis.gl/react-google-maps";

// Mapping of status to PNG paths
const statusIcons = {
  "Unassigned": "/pins/pins_-04.png",
  "In Progress": "/pins/pins_-02.png",
  "Resolved": "/pins/pins_-03.png",
  "Pending": "/pins/pins_-01.png",
  "Dismissed": "/pins/pins_-05.png",
  // Add other statuses as needed
};

export const ReportMarker = ({ report, onClick, setMarkerRef, isActive, onClose }) => {
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State to track hover status

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

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : description;
  };

  const handleClick = useCallback(() => {
    onClick(report._id);
    setInfoWindowVisible((prev) => !prev);
  }, [onClick, report._id]);

  const ref = useCallback(
    (marker) => setMarkerRef(marker, report._id),
    [setMarkerRef, report._id]
  );

  return (
    <>
      <AdvancedMarker
        position={{ lat: parseFloat(report.latitude), lng: parseFloat(report.longitude) }}
        anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
        onMouseLeave={() => setIsHovered(false)} // Reset hover state
      >
        <img 
          src={statusIcons[report.report_status.stat_name] || "/pins/pins_-06.png"} 
          alt={report.report_status.stat_name} 
          className="marker-icon" 
          style={{ 
            height: isHovered ? '3rem' : '2.5rem',
            transform: isHovered ? 'translateY(-0.5rem)' : 'translateY(0)',
            transition: 'height 0.3s ease, transform 0.3s ease' // Smooth transition
          }}
        />
      </AdvancedMarker>

      {isActive && infoWindowVisible && (
        <InfoWindow
          position={{ lat: parseFloat(report.latitude), lng: parseFloat(report.longitude) }}
          onCloseClick={() => {
            setInfoWindowVisible(false);
            onClose();
          }}
        >
          <div className="m-0 p-0">
            <div className="w-full">
              <div className="flex-col flex sm:flex-row justify-between gap-1 sm:gap-2 items-start">
                <div className="text-[0.95rem] leading-none font-bold mb-1">
                  {truncateDescription(report.report_desc)}
                </div>
                <div className="px-2 font-medium text-xs rounded-sm py-1 bg-black text-white">
                  {report.report_status.stat_name}
                </div>
              </div>
              <div className="font-medium text-[0.7rem] bg-muted border-t border-l border-r border-gray-300 p-1 mt-1">
                {formatDate(report.createdAt)}
              </div>
              <div className="font-medium text-[0.7rem] border p-1 mb-1">
                {report.report_desc}
                {report.infraType?.name}
              </div>

              <div className="flex gap-2">
                <div className="flex font-medium text-[0.7rem] p-1">
                  {report.report_address}
                </div>
                <div className="font-medium text-[0.7rem] text-muted-foreground p-1">
                  <p>LAT: {report.latitude}</p>
                  <p>LNG: {report.longitude}</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <img
                src={report.report_img}
                alt={report.report_desc}
                className="rounded-md border max-h-[200px] w-full object-contain"
              />
            </div>
            {report.report_mod && (
              <div className="font-medium text-[0.7rem] bg-muted border border-gray-300 p-1 mt-2">
                Handled By: {report.report_mod.name}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};
