export function filterDoctors(
  doctors,
  search,
  statusFilter
) {
  const query = search.trim().toLowerCase();

  return doctors.filter((doctor) => {
    const name =
      String(doctor.name || "").toLowerCase();

    const specialization =
      String(
        doctor.specialization || ""
      ).toLowerCase();

    const sno =
      String(
        doctor.sno ??
        doctor.id ??
        ""
      );

    const searchMatch =
      !query ||
      name.includes(query) ||
      sno.includes(query) ||
      specialization.includes(query);

    const reported =
      Boolean(doctor.reported);

    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Reported" && reported) ||
      (statusFilter === "Not Reported" && !reported);

    return searchMatch && statusMatch;
  });
}