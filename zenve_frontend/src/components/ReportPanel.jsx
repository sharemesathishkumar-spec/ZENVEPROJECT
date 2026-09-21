import { useEffect, useState } from "react";

import {
  getPostVisits,
  getReports,
  submitReport,
} from "../services/api";

// --------------------------------------------------
// GET TODAY'S DATE USING LOCAL TIME
// Avoids UTC date problems caused by toISOString()
// --------------------------------------------------
const getTodayLocal = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function ReportPanel() {
  // --------------------------------------------------
  // REPORT FORM
  // --------------------------------------------------

  const [reportingType, setReportingType] =
    useState("Field");

  const [reportDate, setReportDate] =
    useState(getTodayLocal);

  const [sendTo, setSendTo] =
    useState("Both");

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [visits, setVisits] = useState([]);

  const [history, setHistory] = useState([]);

  // --------------------------------------------------
  // UI STATE
  // --------------------------------------------------

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [showCalls, setShowCalls] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // LOAD POST VISITS + REPORT HISTORY
  // --------------------------------------------------

  const load = async () => {
    try {
      setError("");

      const [
        visitsData,
        reportsData,
      ] = await Promise.all([
        getPostVisits(),
        getReports(),
      ]);

      // ----------------------------------------------
      // POST VISITS
      // ----------------------------------------------

      const visitRecords =
        Array.isArray(visitsData)
          ? visitsData
          : visitsData?.results || [];

      // ----------------------------------------------
      // REPORTS
      // ----------------------------------------------

      const reportRecords =
        Array.isArray(reportsData)
          ? reportsData
          : reportsData?.results || [];

      setVisits(visitRecords);

      setHistory(reportRecords);

    } catch (err) {
      setError(
        err?.message ||
        "Unable to load report information."
      );
    }
  };

  // --------------------------------------------------
  // LOAD DATA WHEN COMPONENT OPENS
  // --------------------------------------------------

  useEffect(() => {
    load();
  }, []);

  // --------------------------------------------------
  // SEND REPORT
  // --------------------------------------------------

  const sendReport = async () => {
    setMessage("");
    setError("");

    // Basic validation
    if (!reportingType) {
      setError("Please select a reporting type.");
      return;
    }

    if (!reportDate) {
      setError("Please select a report date.");
      return;
    }

    if (!sendTo) {
      setError("Please select who the report should be sent to.");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------------
      // POST REPORT TO DJANGO
      // ----------------------------------------------

      await submitReport({
        reporting_type: reportingType,
        report_date: reportDate,
        send_to: sendTo,
      });

      // ----------------------------------------------
      // SUCCESS MESSAGE
      // ----------------------------------------------

      setMessage(
        "Report submitted successfully."
      );

      // ----------------------------------------------
      // REFRESH REPORT HISTORY
      // ----------------------------------------------

      await load();

    } catch (err) {
      setError(
        err?.message ||
        "Unable to submit report."
      );

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CLOSE MODALS
  // --------------------------------------------------

  const closeCalls = () => {
    setShowCalls(false);
  };

  const closeHistory = () => {
    setShowHistory(false);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      <section className="report-panel">

        {/* ==========================================
            REPORTING TYPE
        ========================================== */}

        <div className="field-group">

          <label htmlFor="reporting-type">
            REPORTING TYPE *
          </label>

          <select
            id="reporting-type"
            value={reportingType}
            onChange={(e) =>
              setReportingType(e.target.value)
            }
          >
            <option value="Field">
              Field
            </option>

            <option value="Online">
              Online
            </option>

            <option value="Phone">
              Phone
            </option>
          </select>

        </div>

        {/* ==========================================
            REPORT DATE
        ========================================== */}

        <div className="field-group">

          <label htmlFor="report-date">
            REPORT DATE *
          </label>

          <input
            id="report-date"
            type="date"
            value={reportDate}
            onChange={(e) =>
              setReportDate(e.target.value)
            }
          />

        </div>

        {/* ==========================================
            SEND TO
        ========================================== */}

        <div className="field-group send-field">

          <label htmlFor="send-to">
            SEND REPORT TO *
          </label>

          <select
            id="send-to"
            value={sendTo}
            onChange={(e) =>
              setSendTo(e.target.value)
            }
          >

            <option value="Both">
              Both (Sales Manager & Regional Manager)
            </option>

            <option value="Sales Manager">
              Sales Manager
            </option>

            <option value="Regional Manager">
              Regional Manager
            </option>

          </select>

        </div>

        {/* ==========================================
            SUCCESS / ERROR MESSAGE
        ========================================== */}

        {(message || error) && (
          <div
            className={
              error
                ? "error-message"
                : "success-message"
            }
          >
            {error || message}
          </div>
        )}

        {/* ==========================================
            ACTION BUTTONS
        ========================================== */}

        <div className="report-actions">

          {/* VIEW REPORTED CALLS */}

          <button
            className="outline-btn"
            type="button"
            onClick={() =>
              setShowCalls(true)
            }
          >
            View Reported Calls ({visits.length})
          </button>

          {/* SUBMISSION HISTORY */}

          <button
            className="outline-btn"
            type="button"
            onClick={() =>
              setShowHistory(true)
            }
          >
            Submission History
          </button>

          {/* SEND REPORT */}

          <button
            className="send-btn"
            type="button"
            onClick={sendReport}
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Report"}
          </button>

        </div>

      </section>

      {/* ==================================================
          REPORTED CALLS MODAL
      ================================================== */}

      {showCalls && (
        <div
          className="modal-overlay"
          onClick={closeCalls}
        >

          <div
            className="report-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="modal-header">

              <h2>
                Reported Calls
              </h2>

              <button
                type="button"
                onClick={closeCalls}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* CONTENT */}

            {visits.length === 0 ? (

              <p className="empty-message">
                No reported calls found.
              </p>

            ) : (

              <div className="report-list">

                {visits.map((visit) => (

                  <div
                    className="report-row"
                    key={visit.id}
                  >

                    {/* DOCTOR */}

                    <div>
                      <strong>
                        {visit.doctor?.name ||
                          visit.doctor_name ||
                          "Doctor"}
                      </strong>
                    </div>

                    {/* PRODUCT */}

                    <div>
                      Product:{" "}
                      {visit.product || "—"}
                    </div>

                    {/* CAMPAIGN */}

                    <div>
                      Campaign:{" "}
                      {visit.campaign || "—"}
                    </div>

                    {/* OUTCOME */}

                    <div>
                      Outcome:{" "}
                      {visit.outcome || "—"}
                    </div>

                    {/* FEEDBACK */}

                    <div>
                      Feedback:{" "}
                      {visit.feedback || "—"}
                    </div>

                    {/* NEXT VISIT */}

                    <div>
                      Next Visit:{" "}
                      {visit.next_visit_date ||
                        "—"}
                    </div>

                    {/* CREATED DATE */}

                    <div>
                      Submitted:{" "}
                      {visit.created_at || "—"}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      )}

      {/* ==================================================
          SUBMISSION HISTORY MODAL
      ================================================== */}

      {showHistory && (
        <div
          className="modal-overlay"
          onClick={closeHistory}
        >

          <div
            className="report-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="modal-header">

              <h2>
                Submission History
              </h2>

              <button
                type="button"
                onClick={closeHistory}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* CONTENT */}

            {history.length === 0 ? (

              <p className="empty-message">
                No submission history found.
              </p>

            ) : (

              <div className="history-list">

                {history.map((report) => (

                  <div
                    className="history-row"
                    key={report.id}
                  >

                    {/* REPORT TYPE */}

                    <div>
                      <strong>
                        {report.reporting_type ||
                          "Report"}
                      </strong>
                    </div>

                    {/* REPORT DATE */}

                    <div>
                      Date:{" "}
                      {report.report_date || "—"}
                    </div>

                    {/* SEND TO */}

                    <div>
                      Send To:{" "}
                      {report.send_to || "—"}
                    </div>

                    {/* DOCTOR */}

                    <div>
                      Doctor:{" "}
                      {report.doctor?.name ||
                        report.doctor_name ||
                        "Not specified"}
                    </div>

                    {/* SUBMITTED TIME */}

                    <div>
                      Submitted:{" "}
                      {report.submitted_at ||
                        "—"}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      )}

    </>
  );
}