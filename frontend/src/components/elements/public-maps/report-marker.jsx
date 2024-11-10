import React, { useCallback, useState } from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusIcons = {
  Unassigned: "/pins/pins_-04.png",
  "In Progress": "/pins/pins_-02.png",
  Resolved: "/pins/pins_-03.png",
  Pending: "/pins/pins_-01.png",
  Dismissed: "/pins/pins_-05.png",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy hh:mm:ss aa");
};

export const ReportMarker = ({
  report,
  onClick,
  setMarkerRef,
  isActive,
  onClose,
  isPublicMap,
}) => {
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const truncateDescription = (description) => {
    return (
      description.split(" ").slice(0, 10).join(" ") +
      (description.split(" ").length > 10 ? "..." : "")
    );
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
        position={{
          lat: parseFloat(report.latitude),
          lng: parseFloat(report.longitude),
        }}
        anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={
            statusIcons[report.report_status?.stat_name] || "/pins/pins_-06.png"
          }
          alt={report.report_status?.stat_name}
          className="marker-icon"
          style={{
            height: isHovered ? "3rem" : "2.5rem",
            transform: isHovered ? "translateY(-0.5rem)" : "translateY(0)",
            transition: "height 0.3s ease, transform 0.3s ease",
          }}
        />
      </AdvancedMarker>

      {isActive && infoWindowVisible && (
        <InfoWindow
          position={{
            lat: parseFloat(report.latitude),
            lng: parseFloat(report.longitude),
          }}
          onCloseClick={() => {
            setInfoWindowVisible(false);
            onClose();
          }}
        >
          <div className="m-0 p-0 max-w-sm">
            <div className="w-full">
              <div className="flex-col flex sm:flex-row justify-between gap-1 sm:gap-2 items-start">
                <div className="text-[0.95rem] leading-none font-bold">
                  {truncateDescription(report.report_desc)}
                </div>
                <div className="px-2 font-medium text-xs rounded-sm border-muted-foreground border text-muted-foreground">
                  {report.report_status?.stat_name}
                </div>
              </div>
              <div className="flex justify-between font-medium text-[0.7rem] bg-muted border-gray-300 p-1 mt-1">
                {!isPublicMap && <div>{report.report_by}</div>}
                {!isPublicMap && <div>{report.report_contactNum}</div>}
                <div>{formatDate(report.createdAt)}</div>
              </div>
              <div className="font-medium text-[0.7rem] p-1 mb-1">
                {report.report_desc}
                {report.infraType?.name}
              </div>
              <div className="flex flex-col gap-1 justify-between">
                <div className="flex font-medium text-[0.7rem] p-1">
                  {report.report_address}
                </div>
                <div className="font-medium text-[0.7rem] text-muted-foreground p-1">
                  <p>LAT: {report.latitude}</p>
                  <p>LNG: {report.longitude}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 relative">
              <a
                href={report.report_img}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={report.report_img}
                  alt={report.report_desc}
                  className="rounded-md border max-h-[200px] w-full object-cover mb-3"
                />
              </a>
              <Button
                variant="ghost"
                onClick={() => window.open(report.report_img, "_blank")}
                className="absolute bottom-2 right-2 text-white"
                title="View Fullscreen"
              >
                <Maximize size={14} />
              </Button>
            </div>

            {report.report_mod && (
              <div className="flex">
                <div className="font-medium text-[0.7rem] bg-muted border-gray-300 p-1">
                  C/O:
                </div>
                <div className="flex-grow font-medium text-[0.7rem] border-gray-300 p-1">
                  {report.report_mod.name}
                </div>
              </div>
            )}
            {report.report_time_resolved && report.report_status.stat_name === "Resolved" && (
              <div className="flex">
                <div className="font-medium text-[0.7rem] bg-muted border-gray-300 p-1">
                  TIME RESOLVED:
                </div>
                <div className="flex-grow font-medium text-[0.7rem] border-gray-300 p-1">
                  {formatDate(report.report_time_resolved)}
                </div>
              </div>
            )}
              {!isPublicMap && report.status_remark && (
              <div className="flex">
              <div className="font-medium text-[0.7rem] bg-muted  border-gray-300 p-1">
                STATUS REMARKS:
              </div>
              <div className="flex-grow font-medium text-[0.7rem] border-gray-300 p-1">
                {report.status_remark}
              </div>
            </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};
