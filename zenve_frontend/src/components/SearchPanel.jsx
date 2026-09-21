import { useState } from "react";

export default function SearchPanel({
  doctors,
  search,
  setSearch,
  selectedDoctor,
  setSelectedDoctor,
  onAddDoctor,
  onRemoveVisitDetails,
}) {
  const [selectedId, setSelectedId] = useState("");

  const handleSelect = (event) => {
    const id = event.target.value;

    setSelectedId(id);

    if (!id) {
      setSelectedDoctor(null);
      return;
    }

    const doctor = doctors.find(
      (item) => String(item.id ?? item.sno) === String(id)
    );

    setSelectedDoctor(doctor || null);
  };

  const handleAdd = () => {
    if (!selectedDoctor) {
      alert("Please select a doctor first.");
      return;
    }

    onAddDoctor(selectedDoctor);
  };

  const handleRemove = () => {
    if (!selectedDoctor) {
      alert("Please select a doctor first.");
      return;
    }

    onRemoveVisitDetails(selectedDoctor);
  };

  return (
    <section className="search-panel">

      {/* SEARCH DOCTOR */}
      <div className="search-box">
        <label>SEARCH DOCTOR</label>

        <input
          type="text"
          placeholder="Type name, S No., or speciality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SELECT DOCTOR */}
      <div className="doctor-select">
        <label>SELECT DOCTOR</label>

        <select
          value={selectedId}
          onChange={handleSelect}
        >
          <option value="">
            — All region doctors added ({doctors.length}) —
          </option>

          {doctors.map((doctor) => (
            <option
              key={doctor.id ?? doctor.sno}
              value={doctor.id ?? doctor.sno}
            >
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      {/* ADD */}
      <button
        className="add-btn"
        type="button"
        onClick={handleAdd}
      >
        + Add
      </button>

      {/* REMOVE */}
      <button
        className="visit-btn"
        type="button"
        onClick={handleRemove}
      >
        Remove Visit Details
      </button>

    </section>
  );
}