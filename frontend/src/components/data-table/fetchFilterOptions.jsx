import axios from "axios";

export const fetchFilterOptions = async () => {
  const filterOptions = {
    infraType: [],
    reportMod: [],
    reportStatus: [],
  };

  try {
    const [infraResponse, modResponse, statusResponse] = await Promise.all([
      axios.get("/api/infrastructure-types"),
      axios.get("/api/users/moderators-list"),
      axios.get("/api/status"),
    ]);

    filterOptions.infraType = infraResponse.data.map((type) => ({
      label: type.infra_name,
      value: type._id,
    }));

    filterOptions.reportMod = modResponse.data.map((mod) => ({
      label: mod.name,
      value: mod._id,
    }));

    filterOptions.reportStatus = statusResponse.data.map((status) => ({
      label: status.stat_name,
      value: status._id,
    }));

  } catch (error) {
    console.error("Error fetching filter options:", error);
  }

  return filterOptions;
};
