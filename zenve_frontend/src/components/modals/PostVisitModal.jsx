import { useState } from "react";

import {
  submitPostVisit,
  submitReport,
} from "../../services/api";


export default function PostVisitModal({
  doctor,
  onClose,
  onSaved,
}) {

  const [form, setForm] = useState({
    product: "",
    campaign: "",
    outcome: "Interested",
    nextVisitDate: "",
    prescriptions: "",
    feedback: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // ============================================================
  // UPDATE FORM
  // ============================================================

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };


  // ============================================================
  // SAVE POST VISIT + REPORT
  // ============================================================

  const save = async (event) => {

    event.preventDefault();

    // ----------------------------------------------------------
    // VALIDATE PRODUCT
    // ----------------------------------------------------------

    if (!form.product.trim()) {
      setError("Please enter the product.");
      return;
    }


    // ----------------------------------------------------------
    // VALIDATE DOCTOR
    // ----------------------------------------------------------

    if (!doctor?.id) {
      setError("Doctor ID is missing.");
      return;
    }


    setSaving(true);
    setError("");


    try {

      // ========================================================
      // 1. CREATE POST VISIT
      // ========================================================

      const postVisit = await submitPostVisit({

        doctor_id: doctor.id,

        product: form.product.trim(),

        campaign: form.campaign.trim(),

        outcome: form.outcome,

        next_visit_date:
          form.nextVisitDate || null,

        prescriptions:
          form.prescriptions.trim(),

        feedback:
          form.feedback.trim(),
      });


      console.log(
        "Post Visit created:",
        postVisit
      );


      // ========================================================
      // 2. CREATE REPORT FOR SAME DOCTOR
      // ========================================================

      const report = await submitReport({

        doctor_id: doctor.id,

        // Must match Django Report.REPORTING_TYPES
        reporting_type: "Field",

        report_date:
          new Date()
            .toISOString()
            .split("T")[0],

        // Must match Django Report.SEND_TO
        send_to: "Both",
      });


      console.log(
        "Report created:",
        report
      );


      // ========================================================
      // 3. REFRESH PARENT DATA
      // ========================================================

      onSaved?.();


      // ========================================================
      // 4. CLOSE MODAL
      // ========================================================

      onClose();


    } catch (err) {

      console.error(
        "Failed to save Post Visit / Report:",
        err
      );

      setError(
        err.message ||
        "Unable to save the visit and report."
      );

    } finally {

      setSaving(false);

    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="modal-overlay">

      <div className="modal">


        {/* ======================================================
            CLOSE BUTTON
        ====================================================== */}

        <button
          type="button"
          className="close"
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>


        {/* ======================================================
            TITLE
        ====================================================== */}

        <h2>
          Post Visit — {doctor?.name || "Doctor"}
        </h2>


        {/* ======================================================
            DOCTOR INFORMATION
        ====================================================== */}

        <div className="doctor-info">

          <div>
            <strong>
              Sno:
            </strong>{" "}
            {doctor?.sno ?? doctor?.id ?? "—"}
          </div>


          <span className="speciality-tag">
            {doctor?.specialization || "—"}
          </span>


          <div>
            <strong>
              Phone:
            </strong>{" "}
            {doctor?.phone || "—"}
          </div>


          <div>
            <strong>
              City:
            </strong>{" "}
            {doctor?.city || "—"}
          </div>


          <div>
            <strong>
              Pin:
            </strong>{" "}
            {doctor?.pin || "—"}
          </div>


          <div>
            <strong>
              Specialization:
            </strong>{" "}
            {doctor?.specialization || "—"}
          </div>

        </div>


        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={save}>


          {/* ====================================================
              PRODUCT + CAMPAIGN
          ==================================================== */}

          <div className="form-grid">

            <div>

              <label>
                PRODUCT *
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Nebicard, Losar"
                value={form.product}
                onChange={(event) =>
                  update(
                    "product",
                    event.target.value
                  )
                }
                disabled={saving}
              />

            </div>


            <div>

              <label>
                CAMPAIGN / SALES ACTIVITY
              </label>

              <input
                type="text"
                placeholder="e.g. HeartBeat 2026"
                value={form.campaign}
                onChange={(event) =>
                  update(
                    "campaign",
                    event.target.value
                  )
                }
                disabled={saving}
              />

            </div>

          </div>


          {/* ====================================================
              OUTCOME + NEXT VISIT
          ==================================================== */}

          <div className="form-grid">

            <div>

              <label>
                CALL OUTCOME *
              </label>

              <select
                value={form.outcome}
                onChange={(event) =>
                  update(
                    "outcome",
                    event.target.value
                  )
                }
                disabled={saving}
              >

                <option value="Interested">
                  Interested
                </option>

                <option value="Prescribed">
                  Prescribed
                </option>

                <option value="Needs Follow-up">
                  Needs Follow-up
                </option>

                <option value="Not Available">
                  Not Available
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>


            <div>

              <label>
                NEXT VISIT DATE
              </label>

              <input
                type="date"
                value={form.nextVisitDate}
                onChange={(event) =>
                  update(
                    "nextVisitDate",
                    event.target.value
                  )
                }
                disabled={saving}
              />

            </div>

          </div>


          {/* ====================================================
              PRESCRIPTIONS
          ==================================================== */}

          <div>

            <label>
              PRESCRIPTIONS / PRODUCTS DISCUSSED
            </label>

            <input
              type="text"
              placeholder="e.g. Nebicard 5mg — 10 strips/month"
              value={form.prescriptions}
              onChange={(event) =>
                update(
                  "prescriptions",
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* ====================================================
              FEEDBACK
          ==================================================== */}

          <div>

            <label>
              DOCTOR FEEDBACK / OBSERVATIONS
            </label>

            <textarea
              placeholder="What did the doctor say? Any objections or requests?"
              value={form.feedback}
              onChange={(event) =>
                update(
                  "feedback",
                  event.target.value
                )
              }
              disabled={saving}
            />

          </div>


          {/* ====================================================
              FOOTER
          ==================================================== */}

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
                : "✓ Mark as Reported"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}