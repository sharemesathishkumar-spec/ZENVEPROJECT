// ============================================================
// ZENVE API
// React Frontend -> Django REST API -> MySQL
// ============================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");


// ============================================================
// COMMON REQUEST FUNCTION
// ============================================================

async function request(path, options = {}) {

  const url = `${API_BASE_URL}${path}`;

  try {

    const response = await fetch(url, {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });


    let body = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }


    // --------------------------------------------------------
    // BACKEND ERROR
    // --------------------------------------------------------

    if (!response.ok) {

      let detail = "Backend request failed.";

      if (body?.detail) {

        detail = body.detail;

      } else if (body?.message) {

        detail = body.message;

      } else if (
        body &&
        typeof body === "object"
      ) {

        const errors = Object.values(body)
          .flat()
          .filter(Boolean)
          .join(" ");

        if (errors) {
          detail = errors;
        }
      }

      throw new Error(detail);
    }


    return body;

  } catch (error) {

    // --------------------------------------------------------
    // NETWORK / CONNECTION ERROR
    // --------------------------------------------------------

    if (error instanceof TypeError) {

      throw new Error(
        `Failed to connect to Django backend at ${API_BASE_URL}. ` +
        `Make sure Django is running on http://127.0.0.1:8000.`
      );
    }

    throw error;
  }
}


// ============================================================
// DOCTORS
// ============================================================

// GET all doctors

export const getDoctors = () => {
  return request("/doctors/");
};


// POST create a new doctor

export const createDoctor = (payload) => {

  return request("/doctors/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

};


// GET single doctor

export const getDoctor = (id) => {

  return request(`/doctors/${id}/`);

};


// PUT update doctor

export const updateDoctor = (id, payload) => {

  return request(`/doctors/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

};


// PATCH update doctor

export const patchDoctor = (id, payload) => {

  return request(`/doctors/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

};


// DELETE doctor

export const deleteDoctor = (id) => {

  return request(`/doctors/${id}/`, {
    method: "DELETE",
  });

};


// ============================================================
// PRE VISITS
// ============================================================

// GET all pre-visits

export const getPreVisits = () => {

  return request("/pre-visits/");

};


// POST pre-visit

export const submitPreVisit = (payload) => {

  return request("/visits/pre/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

};


// GET single pre-visit

export const getPreVisit = (id) => {

  return request(`/pre-visits/${id}/`);

};


// PUT pre-visit

export const updatePreVisit = (id, payload) => {

  return request(`/pre-visits/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

};


// DELETE pre-visit

export const deletePreVisit = (id) => {

  return request(`/pre-visits/${id}/`, {
    method: "DELETE",
  });

};


// ============================================================
// POST VISITS
// ============================================================

// GET all post-visits

export const getPostVisits = () => {

  return request("/post-visits/");

};


// POST post-visit

export const submitPostVisit = (payload) => {

  return request("/visits/post/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

};


// GET single post-visit

export const getPostVisit = (id) => {

  return request(`/post-visits/${id}/`);

};


// PUT post-visit

export const updatePostVisit = (id, payload) => {

  return request(`/post-visits/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

};


// DELETE post-visit

export const deletePostVisit = (id) => {

  return request(`/post-visits/${id}/`, {
    method: "DELETE",
  });

};


// ============================================================
// REPORTS
// ============================================================

// GET all reports

export const getReports = () => {

  return request("/reports/");

};


// POST report
// IMPORTANT:
// This creates a Report associated with a Doctor.

export const submitReport = (payload) => {

  return request("/visits/report/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

};


// GET single report

export const getReport = (id) => {

  return request(`/reports/${id}/`);

};


// PUT report

export const updateReport = (id, payload) => {

  return request(`/reports/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

};


// DELETE report

export const deleteReport = (id) => {

  return request(`/reports/${id}/`, {
    method: "DELETE",
  });

};


// ============================================================
// EXPORT API BASE URL
// ============================================================

export {
  API_BASE_URL,
};