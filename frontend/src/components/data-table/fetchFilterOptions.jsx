import axios from "axios";

export const fetchFilterOptions = async () => {
  const filterOptions = {
    infraType: [],
    reportMod: [],
    reportStatus: [],
  };

  try {
    // Fetch infrastructure types
    const infraResponse = await axios.get("/api/infrastructure-types");
    filterOptions.infraType = infraResponse.data.map((type) => ({
      label: type.infra_name,
      value: type._id,
    }));

    // Fetch moderators list
    const modResponse = await axios.get("/api/users/moderators-list");
    filterOptions.reportMod = modResponse.data.map((mod) => ({
      label: mod.name,
      value: mod._id,
    }));

    // Fetch report statuses
    const statusResponse = await axios.get("/api/status");
    filterOptions.reportStatus = statusResponse.data.map((status) => ({
      label: status.stat_name,
      value: status._id,
    }));

  } catch (error) {
    console.error("Error fetching filter options:", error);
  }

  return filterOptions;
};
