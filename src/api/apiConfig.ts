const API_BASE_URL = "http://localhost:5000";

export const API_URLS = {
  upload: () => `${API_BASE_URL}/upload`,
  download: (type: string, format: string, filename: string) =>
    `${API_BASE_URL}/download/${type}/${format}/${filename}`,
  highlights: (filename: string) =>
    `${API_BASE_URL}/highlights/${filename}`,
};

export default API_BASE_URL;