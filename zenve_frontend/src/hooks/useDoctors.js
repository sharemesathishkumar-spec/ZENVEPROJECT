import { useCallback, useEffect, useState } from "react";
import { getDoctors } from "../services/api";

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDoctors();
      const records = Array.isArray(data) ? data : (data.results || data.doctors || []);
      setDoctors(records);
    } catch (err) {
      setDoctors([]);
      setError(err.message || "Unable to load doctors from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const markReported = useCallback((sno) => {
    setDoctors((current) =>
      current.map((doctor) =>
        doctor.sno === sno || doctor.id === sno
          ? { ...doctor, reported: true }
          : doctor
      )
    );
  }, []);

  return { doctors, loading, error, reload: loadDoctors, markReported };
}
