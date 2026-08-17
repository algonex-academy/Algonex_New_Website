import apiClient from "./client";

export const getBackups = async () => {
  const response = await apiClient.get("/admin/backups/");
  return response.data;
};

export const createBackup = async () => {
  const response = await apiClient.post("/admin/backups/create/");
  return response.data;
};

export const restoreBackup = async (password, filename = null) => {
  const response = await apiClient.post("/admin/backups/restore/", {
    password,
    filename,
  });
  return response.data;
};
