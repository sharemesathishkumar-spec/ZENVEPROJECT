const API_URL = "http://127.0.0.1:8000/api";

export async function apiFetch(endpoint, options = {}) {
  let accessToken = localStorage.getItem(
    "zenve_access_token"
  );

  const makeRequest = async (token) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  // First request
  let response = await makeRequest(accessToken);

  // Access token expired
  if (response.status === 401) {
    const refreshToken = localStorage.getItem(
      "zenve_refresh_token"
    );

    // No refresh token -> logout
    if (!refreshToken) {
      return response;
    }

    // Ask Django for a new access token
    const refreshResponse = await fetch(
      `${API_URL}/auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    // Refresh token also expired/invalid
    if (!refreshResponse.ok) {
      localStorage.removeItem(
        "zenve_access_token"
      );

      localStorage.removeItem(
        "zenve_refresh_token"
      );

      window.location.reload();

      return response;
    }

    const refreshData =
      await refreshResponse.json();

    // Save new access token
    localStorage.setItem(
      "zenve_access_token",
      refreshData.access
    );

    accessToken = refreshData.access;

    // Retry original request
    response = await makeRequest(accessToken);
  }

  return response;
}