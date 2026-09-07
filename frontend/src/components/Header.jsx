function Header({ onNewPatient }) {
  return (
    <header className="header">
      <div>
        <h1>Patients</h1>
        <p>Manage your patients and their medical information</p>
      </div>

      <button
        className="new-patient-btn"
        onClick={onNewPatient}
      >
        + New patient
      </button>
    </header>
  );
}

export default Header;