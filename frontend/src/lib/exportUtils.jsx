import { mkConfig, generateCsv, download } from "export-to-csv";
import { format } from "date-fns";

// Function to check if a value is a valid date
const isValidDate = (value) => {
  const date = new Date(value);
  return typeof value === 'string' || typeof value === 'number' || value instanceof Date
    ? !isNaN(date.getTime()) && typeof value !== 'boolean' 
    : false;
};
// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : format(date, "MMMM dd, yyyy hh:mm:ss aa");
};

export const exportExcel = (rows, userInfo, activeTab, activeButton, table) => {
  const visibleColumns = table.getVisibleLeafColumns();

  const labeledColumns = visibleColumns.filter(
    (column) => column.accessorFn && column.accessorFn !== undefined && column.id !== "is_new"
  );

  console.log("Filtered Labeled Columns:", labeledColumns);

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

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: `InfraSee${filenameSuffix}`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const rowData = rows.map((row) => {
    const original = row.original;
    let data = {};

    labeledColumns.forEach((column) => {
      let value = original[column.id];

      if (value && typeof value === "object") {
        const keys = Object.keys(value);
        if (keys.length > 1) {
          value = value[keys[1]];
        } else {
          value = JSON.stringify(value);
        }
      }

      if (Array.isArray(value)) {
        value = value.join(", ");
      }

      if (isValidDate(value)) {
        value = formatDate(value);
      }

      data[column.id] = value;
    });

    return data || { _id: original._id };
  });

  if (rowData.length === 0) {
    console.error("No data to export");
    return;
  }

  const csv = generateCsv(csvConfig)(rowData);
  download(csvConfig)(csv);
};
