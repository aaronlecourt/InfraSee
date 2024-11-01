import { mkConfig, generateCsv, download } from "export-to-csv";
import { format } from "date-fns";

const formatDate = (dateString) => {
  if (!dateString) return null; // Return null for undefined or null inputs
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? null
    : format(date, "MMMM dd, yyyy hh:mm:ss aa");
};

export const exportExcel = (rows, userInfo, activeTab, activeButton) => {
  // Determine the filename based on the active button
  let filenameSuffix = "";

  if (userInfo.isAdmin) {
    switch (activeButton) {
      case "reports":
        filenameSuffix = "_Reports";
        break;
      case "accounts":
        switch (activeTab) {
          case "all":
            filenameSuffix = "_All-Accounts";
            break;
          case "moderators":
            filenameSuffix = "_Moderator-Accounts";
            break;
          case "submoderators":
            filenameSuffix = "_SubModerator-Accounts";
            break;
          case "deactivated":
            filenameSuffix = "_Deactivated-Accounts";
            break;
          default:
            filenameSuffix = "_Accounts";
        }
        break;
      default:
        filenameSuffix = "";
    }
  } else if (userInfo.isModerator) {
    filenameSuffix = activeTab === "reports" ? "_Reports" : "_Hidden-Reports";
  } else if (userInfo.isSubModerator) {
    filenameSuffix = activeTab === "reports" ? "_Reports" : "";
  }

  // Define CSV configuration with dynamic filename
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: `InfraSee${filenameSuffix}`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const rowData = rows.map((row) => {
    const original = row.original;
    let data = {}; // Initialize data

    if (userInfo.isAdmin) {
      switch (activeButton) {
        case "reports":
          data = {
            _id: original._id,
            report_by: original.report_by,
            report_contactNum: original.report_contactNum,
            report_desc: original.report_desc,
            report_address: original.report_address,
            latitude: original.latitude,
            longitude: original.longitude,
            infraType: original.infraType?.infra_name,
            report_mod: original.report_mod?.name,
            report_status: original.report_status?.stat_name,
            createdAt: formatDate(original.createdAt),
            updatedAt: formatDate(original.updatedAt),
          };
          break;

        case "accounts":
          switch (activeTab) {
            case "all":
              data = {
                _id: original._id,
                name: original.name,
                email: original.email,
                role: original.isAdmin
                  ? "Administrator"
                  : original.isModerator
                  ? "Moderator"
                  : original.isSubModerator
                  ? "Submoderator"
                  : "User",
                createdAt: formatDate(original.createdAt),
                updatedAt: formatDate(original.updatedAt),
              };
              break;
            case "moderators":
              data = {
                _id: original._id,
                name: original.name,
                email: original.email,
                role: original.isAdmin
                  ? "Administrator"
                  : original.isModerator
                  ? "Moderator"
                  : original.isSubModerator
                  ? "Submoderator"
                  : "User",
                createdAt: formatDate(original.createdAt),
                updatedAt: formatDate(original.updatedAt),
              };
              break;
            case "submoderators":
              data = {
                _id: original._id,
                name: original.name,
                email: original.email,
                assignedModerator: original.assignedModerator?.name,
                createdAt: formatDate(original.createdAt),
                updatedAt: formatDate(original.updatedAt),
              };
              break;
            case "deactivated":
              data = {
                _id: original._id,
                name: original.name,
                email: original.email,
                role: original.isAdmin
                  ? "Administrator"
                  : original.isModerator
                  ? "Moderator"
                  : original.isSubModerator
                  ? "Submoderator"
                  : "User",
                assignedModerator: original.assignedModerator?.name,
                createdAt: formatDate(original.createdAt),
                updatedAt: formatDate(original.updatedAt),
              };
              break;
            default:
              data = original;
          }
          break;

        default:
          data = original;
      }
    } else if (userInfo.isModerator) {
      switch (activeTab) {
        case "reports":
          data = {
            _id: original._id,
            report_img: original.report_img, // Include the report image URL
            report_by: original.report_by,
            report_contactNum: original.report_contactNum,
            report_desc: original.report_desc,
            report_address: original.report_address,
            latitude: original.latitude,
            longitude: original.longitude,
            infraType: original.infraType?.infra_name,
            report_mod: original.report_mod?.name,
            report_status: original.report_status?.stat_name,
            report_time_resolved: formatDate(original.report_time_resolved), // Use the updated formatDate function
            request_time: formatDate(original.request_time), // Use the updated formatDate function
            status_remark: original.status_remark,
            createdAt: formatDate(original.createdAt), // Use the updated formatDate function
            updatedAt: formatDate(original.updatedAt), // Use the updated formatDate function
          };
          break;

        case "hidden":
          data = {
            _id: original._id,
            report_by: original.report_by,
            report_contactNum: original.report_contactNum,
            report_desc: original.report_desc,
            report_address: original.report_address,
            latitude: original.latitude,
            longitude: original.longitude,
            infraType: original.infraType?.infra_name,
            report_mod: original.report_mod?.name,
            report_status: original.report_status?.stat_name,
            report_time_resolved: formatDate(original.report_time_resolved),
            request_time: formatDate(original.request_time),
            status_remark: original.status_remark,
            createdAt: formatDate(original.createdAt),
            updatedAt: formatDate(original.updatedAt),
            hidden_at: formatDate(original.hidden_at),
          };
          break;

        default:
          data = original;
      }
    } else if (userInfo.isSubModerator) {
      switch (activeTab) {
        case "reports":
          data = {
            _id: original._id,
            report_img: original.report_img, // Include the report image URL
            report_by: original.report_by,
            report_contactNum: original.report_contactNum,
            report_desc: original.report_desc,
            report_address: original.report_address,
            latitude: original.latitude,
            longitude: original.longitude,
            infraType: original.infraType?.infra_name,
            report_mod: original.report_mod?.name,
            report_status: original.report_status?.stat_name,
            report_time_resolved: formatDate(original.report_time_resolved), // Use the updated formatDate function
            request_time: formatDate(original.request_time), // Use the updated formatDate function
            status_remark: original.status_remark,
            createdAt: formatDate(original.createdAt), // Use the updated formatDate function
            updatedAt: formatDate(original.updatedAt), // Use the updated formatDate function
          };
          break;

        default:
          data = original;
      }
    }

    return data || { _id: original._id }; // Ensure data is always returned
  });

  // Check if rowData is not empty
  if (rowData.length === 0) {
    console.error("No data to export");
    return; // Early exit if there's no data
  }

  const csv = generateCsv(csvConfig)(rowData); // Generate CSV with default headers
  download(csvConfig)(csv); // Trigger download
};
