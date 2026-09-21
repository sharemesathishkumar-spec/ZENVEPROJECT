export default function DoctorTable({
  doctors,
  onDetails,
  onPreVisit,
  onPostVisit,
}) {
  return (
    <section className="table-card">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>

            <th>SNO</th>
            <th>DOCTOR NAME</th>
            <th>PRODUCT</th>
            <th>DISCUSSED</th>
            <th>STATUS</th>
            <th>VIEW</th>
            <th>OPTION</th>
          </tr>
        </thead>

        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-table">
                No doctors found.
              </td>
            </tr>
          ) : (
            doctors.map((doctor) => (
              <tr key={doctor.id ?? doctor.sno}>

                <td>
                  <input type="checkbox" />
                </td>

                <td>
                  {doctor.sno ?? doctor.id}
                </td>

                <td>
                  <div className="doctor-name">

                    <div className="avatar">
                      {doctor.initial ||
                        doctor.name?.charAt(0)?.toUpperCase() ||
                        "D"}
                    </div>

                    <span>
                      {doctor.name}
                    </span>

                  </div>
                </td>

                <td>
                  {doctor.product || "—"}
                </td>

                <td>
                  {doctor.discussed ? "Yes" : "—"}
                </td>

                <td>
                  {doctor.reported ? (
                    <span className="reported-badge">
                      Reported
                    </span>
                  ) : (
                    <span className="status-badge">
                      Not Reported
                    </span>
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => onDetails(doctor)}
                    aria-label={`View ${doctor.name}`}
                  >
                    ◉
                  </button>
                </td>

                <td>
                  <div className="option-buttons">

                    <button
                      type="button"
                      className="pre-btn"
                      onClick={() => onPreVisit(doctor)}
                    >
                      Pre Visit
                    </button>

                    <button
                      type="button"
                      className="post-btn"
                      onClick={() => onPostVisit(doctor)}
                    >
                      Post Visit
                    </button>

                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}