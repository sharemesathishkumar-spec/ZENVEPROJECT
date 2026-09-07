import { useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../api";

function PatientModal({ onClose, onRegister, owners, onOwnerCreated }) {
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");

  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState("");

  const [selectedOwner, setSelectedOwner] = useState("");

  // Register patient
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const patient = {
      pet_name: form.get("petName"),
      species: form.get("species"),
      breed: form.get("breed"),
      sex: form.get("sex"),
      date_of_birth: form.get("dateOfBirth") || null,
      weight: form.get("weight") || null,
      owner: Number(form.get("owner")),
      medical_alerts: form.get("medicalAlerts"),
    };

    onRegister(patient);
  };

  // Create new owner
  const handleCreateOwner = async (e) => {
    e.preventDefault();

    setOwnerError("");

    if (!ownerName.trim()) {
      setOwnerError("Owner name is required.");
      return;
    }

    setOwnerLoading(true);

    try {
      const response = await apiFetch("/owners/", {
        method: "POST",
        body: JSON.stringify({
          name: ownerName.trim(),
          phone: ownerPhone.trim(),
          email: ownerEmail.trim(),
          address: ownerAddress.trim(),
        }),
      });

      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Django returned an unexpected response (HTTP ${response.status}).`,
        );
      }

      // Authentication failed even after refresh
      if (response.status === 401) {
        setOwnerError("Your login session has expired. Please log in again.");
        return;
      }

      // Other API errors
      if (!response.ok) {
        const message =
          data.detail ||
          data.error ||
          (typeof data === "object"
            ? Object.values(data).flat().join(" ")
            : "") ||
          "Unable to create owner.";

        throw new Error(message);
      }

      // Make sure Django returned an owner ID
      if (!data.id) {
        throw new Error("Owner was created, but no owner ID was returned.");
      }

      // Send the new owner to Patients.jsx
      if (onOwnerCreated) {
        onOwnerCreated(data);
      }

      // Automatically select the newly created owner
      setSelectedOwner(String(data.id));

      // Close owner popup
      setShowOwnerForm(false);

      // Clear owner form
      setOwnerName("");
      setOwnerPhone("");
      setOwnerEmail("");
      setOwnerAddress("");
      setOwnerError("");
    } catch (err) {
      console.error("Create owner error:", err);

      setOwnerError(err.message || "Unable to create owner. Please try again.");
    } finally {
      setOwnerLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="patient-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>Register new patient</h2>
            <p>Patient and owner information</p>
          </div>

          <button type="button" className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* PATIENT FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* PET NAME */}
            <div className="form-group">
              <label>Pet name</label>

              <input
                name="petName"
                type="text"
                placeholder="Enter pet name"
                required
              />
            </div>

            {/* SPECIES */}
            <div className="form-group">
              <label>Species</label>

              <select name="species" defaultValue="Dog">
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* BREED */}
            <div className="form-group">
              <label>Breed</label>

              <input name="breed" type="text" placeholder="Enter breed" />
            </div>

            {/* SEX */}
            <div className="form-group">
              <label>Sex</label>

              <select name="sex" defaultValue="Male">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* DATE OF BIRTH */}
            <div className="form-group">
              <label>Date of birth</label>

              <input name="dateOfBirth" type="date" />
            </div>

            {/* WEIGHT */}
            <div className="form-group">
              <label>Weight (kg)</label>

              <input
                name="weight"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
              />
            </div>
          </div>

          {/* OWNER */}
          <div className="form-group full-width">
            <label>Owner</label>

            <select
              name="owner"
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              required
            >
              <option value="" disabled>
                Select owner
              </option>

              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="create-owner-btn"
              onClick={() => {
                setOwnerError("");
                setShowOwnerForm(true);
              }}
            >
              + Create new owner
            </button>
          </div>

          {/* MEDICAL ALERTS */}
          <div className="form-group full-width">
            <label>Medical alerts</label>

            <textarea
              name="medicalAlerts"
              rows="3"
              placeholder="Enter any medical alerts or important information"
            />
          </div>

          {/* PATIENT FOOTER */}
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="register-btn">
              Register patient
            </button>
          </div>
        </form>

        {/* CREATE OWNER POPUP */}
        {showOwnerForm && (
          <div
            className="owner-modal-overlay"
            onMouseDown={() => setShowOwnerForm(false)}
          >
            <div
              className="owner-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* OWNER HEADER */}
              <div className="owner-modal-header">
                <div>
                  <h2>Create new owner</h2>
                  <p>Enter owner information</p>
                </div>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowOwnerForm(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* OWNER ERROR */}
              {ownerError && <div className="owner-error">{ownerError}</div>}

              {/* OWNER FORM */}
              <form onSubmit={handleCreateOwner}>
                {/* NAME */}
                <div className="form-group">
                  <label>Owner name</label>

                  <input
                    type="text"
                    placeholder="Enter owner name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>

                {/* PHONE */}
                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                  />
                </div>

                {/* EMAIL */}
                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    placeholder="Enter email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                  />
                </div>

                {/* ADDRESS */}
                <div className="form-group">
                  <label>Address</label>

                  <textarea
                    rows="3"
                    placeholder="Enter owner address"
                    value={ownerAddress}
                    onChange={(e) => setOwnerAddress(e.target.value)}
                  />
                </div>

                {/* OWNER FOOTER */}
                <div className="owner-modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowOwnerForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="register-btn"
                    disabled={ownerLoading}
                  >
                    {ownerLoading ? "Creating..." : "Create owner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientModal;
