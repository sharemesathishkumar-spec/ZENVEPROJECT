import { useState } from "react";
import { submitPreVisit } from "../../services/api";

export default function PreVisitModal({ doctor, onClose, onSaved }) {
  const [form, setForm] = useState({
    product: "",
    campaign: "",
    objective: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const save = async (event) => {
    event.preventDefault();

    setError("");

    // Check doctor ID
    if (!doctor?.id) {
      setError("Doctor ID is missing.");
      return;
    }

    // Check required fields
    if (!form.product.trim()) {
      setError("Please enter the product.");
      return;
    }

    if (!form.objective.trim()) {
      setError("Please enter the call objective.");
      return;
    }

    setSaving(true);

    try {
      await submitPreVisit({
        doctor_id: doctor.id,
        ...form,
      });

      // Refresh doctor/report data
      await onSaved?.();

      // Close modal after successful save
      onClose();
    } catch (err) {
      setError(
        err.message || "Unable to save the pre visit."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button
          type="button"
          className="close"
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>

        <h2>
          Pre Visit — {doctor?.name || "Doctor"}
        </h2>

        <div className="doctor-info">
          <div>
            <strong>Sno:</strong>{" "}
            {doctor?.sno ?? doctor?.id ?? "—"}
          </div>

          <span className="speciality-tag">
            {doctor?.specialization || "—"}
          </span>

          <div>
            <strong>Phone:</strong>{" "}
            {doctor?.phone || "—"}
          </div>

          <div>
            <strong>City:</strong>{" "}
            {doctor?.city || "—"}
          </div>

          <div>
            <strong>Pin:</strong>{" "}
            {doctor?.pin || "—"}
          </div>

          <div>
            <strong>Specialization:</strong>{" "}
            {doctor?.specialization || "—"}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={save}>

          <div className="form-grid">

            <div>
              <label>PRODUCT *</label>

              <input
                type="text"
                required
                placeholder="Product name"
                value={form.product}
                onChange={(e) =>
                  update("product", e.target.value)
                }
                disabled={saving}
              />
            </div>

            <div>
              <label>CAMPAIGN / SALES ACTIVITY</label>

              <input
                type="text"
                placeholder="Campaign"
                value={form.campaign}
                onChange={(e) =>
                  update("campaign", e.target.value)
                }
                disabled={saving}
              />
            </div>

          </div>

          <div>
            <label>CALL OBJECTIVE *</label>

            <input
              type="text"
              required
              placeholder="What do you plan to discuss?"
              value={form.objective}
              onChange={(e) =>
                update("objective", e.target.value)
              }
              disabled={saving}
            />
          </div>

          <div>
            <label>PRE-VISIT NOTES</label>

            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                update("notes", e.target.value)
              }
              disabled={saving}
            />
          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "✓ Save Pre Visit"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}