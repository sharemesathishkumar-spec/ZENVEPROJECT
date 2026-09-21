import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ReportPanel from "../components/ReportPanel";
import SearchPanel from "../components/SearchPanel";
import StatusFilter from "../components/StatusFilter";
import DoctorTable from "../components/DoctorTable";

import PreVisitModal from "../components/modals/PreVisitModal";
import PostVisitModal from "../components/modals/PostVisitModal";
import DoctorDetailsModal from "../components/modals/DoctorDetailsModal";

import { useDoctors } from "../hooks/useDoctors";
import { filterDoctors } from "../utils/filterDoctors";

import {
  getPreVisits,
  getPostVisits,
  deletePreVisit,
  deletePostVisit,
} from "../services/api";

export default function ReportsPage() {
  const {
    doctors,
    loading,
    error,
    reload,
  } = useDoctors();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modal, setModal] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [addedDoctors, setAddedDoctors] = useState([]);

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  /*
   * Always show all doctors received from Django.
   * The + Add button keeps its own selected-doctor state
   * and does not remove other doctors from the table.
   */
  const tableDoctors = doctors;

  const filteredDoctors = filterDoctors(
    tableDoctors,
    search,
    statusFilter
  );

  // -----------------------------
  // OPEN MODAL
  // -----------------------------

  const openModal = (type, doctor) => {
    setSelectedDoctor(doctor);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDoctor(null);
  };

  // -----------------------------
  // ADD DOCTOR
  // -----------------------------

  const handleAddDoctor = (doctor) => {
    setActionMessage("");
    setActionError("");

    const exists = addedDoctors.some(
      (item) =>
        String(item.id ?? item.sno) ===
        String(doctor.id ?? doctor.sno)
    );

    if (exists) {
      setActionMessage(
        `${doctor.name} is already added.`
      );
      return;
    }

    setAddedDoctors((current) => [
      ...current,
      doctor,
    ]);

    setSelectedDoctor(doctor);

    setActionMessage(
      `${doctor.name} added successfully.`
    );
  };

  // -----------------------------
  // REMOVE VISIT DETAILS
  // -----------------------------

  const handleRemoveVisitDetails = async (doctor) => {
    setActionMessage("");
    setActionError("");

    const doctorId =
      doctor.id ?? doctor.sno;

    const confirmed = window.confirm(
      `Remove visit details for ${doctor.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const [
        preData,
        postData,
      ] = await Promise.all([
        getPreVisits(),
        getPostVisits(),
      ]);

      const preVisits =
        Array.isArray(preData)
          ? preData
          : preData?.results || [];

      const postVisits =
        Array.isArray(postData)
          ? postData
          : postData?.results || [];

      // Find doctor's pre visits
      const doctorPreVisits =
        preVisits.filter((visit) => {
          const visitDoctorId =
            visit.doctor?.id ??
            visit.doctor_id ??
            visit.doctor;

          return (
            String(visitDoctorId) ===
            String(doctorId)
          );
        });

      // Find doctor's post visits
      const doctorPostVisits =
        postVisits.filter((visit) => {
          const visitDoctorId =
            visit.doctor?.id ??
            visit.doctor_id ??
            visit.doctor;

          return (
            String(visitDoctorId) ===
            String(doctorId)
          );
        });

      // Delete pre visits
      await Promise.all(
        doctorPreVisits
          .filter((visit) => visit.id)
          .map((visit) =>
            deletePreVisit(visit.id)
          )
      );

      // Delete post visits
      await Promise.all(
        doctorPostVisits
          .filter((visit) => visit.id)
          .map((visit) =>
            deletePostVisit(visit.id)
          )
      );

      setActionMessage(
        `Visit details removed for ${doctor.name}.`
      );

      await reload();

    } catch (err) {
      setActionError(
        err.message ||
        "Unable to remove visit details."
      );
    }
  };

  // -----------------------------
  // AFTER POST VISIT SAVED
  // -----------------------------

  const handlePostVisitSaved = async () => {
    closeModal();

    await reload();
  };

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        <Header />

        <ReportPanel />

        <SearchPanel
          doctors={doctors}
          search={search}
          setSearch={setSearch}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          onAddDoctor={handleAddDoctor}
          onRemoveVisitDetails={
            handleRemoveVisitDetails
          }
        />

        <StatusFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* SUCCESS MESSAGE */}
        {actionMessage && (
          <div className="success-message">
            {actionMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {actionError && (
          <div className="error-message">
            {actionError}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-message">
            Loading doctors from the backend...
          </div>
        )}

        {/* BACKEND ERROR */}
        {error && (
          <div className="error-message">
            <span>{error}</span>

            <button
              type="button"
              onClick={reload}
            >
              Retry
            </button>
          </div>
        )}

        {/* DOCTOR TABLE */}
        {!loading && !error && (
          <DoctorTable
            doctors={filteredDoctors}

            onDetails={(doctor) =>
              openModal("details", doctor)
            }

            onPreVisit={(doctor) =>
              openModal("pre", doctor)
            }

            onPostVisit={(doctor) =>
              openModal("post", doctor)
            }
          />
        )}

      </main>

      {/* PRE VISIT MODAL */}
      {modal === "pre" &&
        selectedDoctor && (
          <PreVisitModal
            doctor={selectedDoctor}
            onClose={closeModal}
            onSaved={reload}
          />
        )}

      {/* POST VISIT MODAL */}
      {modal === "post" &&
        selectedDoctor && (
          <PostVisitModal
            doctor={selectedDoctor}
            onClose={closeModal}
            onSaved={handlePostVisitSaved}
          />
        )}

      {/* DOCTOR DETAILS MODAL */}
      {modal === "details" &&
        selectedDoctor && (
          <DoctorDetailsModal
            doctor={selectedDoctor}
            onClose={closeModal}
          />
        )}

    </div>
  );
}